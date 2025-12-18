import { useState } from 'react';
import JSZip from 'jszip';

export function useDeployment() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('netlify_token') || '');
  const [siteName, setSiteName] = useState(localStorage.getItem('site_name') || '');
  const [status, setStatus] = useState('idle');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const openDialog = () => {
    setOpen(true);
    setStatus('idle');
    setError('');
  };

  const deploy = async (code) => {
    if (!token) return alert("Enter Netlify Token");
    if (!siteName && !confirm("No name? Creating random.")) return;

    setStatus('deploying'); 
    setError('');
    
    try {
      let siteId = null;
      // 1. Check Site
      const sitesResponse = await fetch('/netlify-api/sites', { headers: { 'Authorization': `Bearer ${token}` } });
      const sites = await sitesResponse.json();
      const existingSite = sites.find(s => s.name === siteName);

      if (existingSite) {
        siteId = existingSite.id;
      } else {
        const createResponse = await fetch('/netlify-api/sites', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: siteName }), 
        });
        if (!createResponse.ok) throw new Error("Name taken or Error");
        const newSiteData = await createResponse.json();
        siteId = newSiteData.id;
      }

      // 2. Zip
      const zip = new JSZip();
      let cleanCode = code || ""; 
      if (!cleanCode.trim().toLowerCase().startsWith('<!doctype html>')) {
        cleanCode = '<!DOCTYPE html>\n' + cleanCode;
      }
      zip.file("index.html", cleanCode);
      zip.file("_headers", "/*\n  Content-Type: text/html; charset=utf-8");
      const blob = await zip.generateAsync({ type: "blob" });

      // 3. Upload
      const deployResponse = await fetch(`/netlify-api/sites/${siteId}/deploys`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/zip' },
        body: blob,
      });

      if (!deployResponse.ok) throw new Error('Upload failed.');
      const deployData = await deployResponse.json();
      
      localStorage.setItem('netlify_token', token);
      localStorage.setItem('site_name', siteName);
      
      setUrl(siteName ? `https://${siteName}.netlify.app` : deployData.ssl_url);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setError(error.message);
    }
  };

  return {
    state: { open, token, siteName, status, url, error },
    actions: { setOpen, setToken, setSiteName, openDialog, deploy }
  };
}
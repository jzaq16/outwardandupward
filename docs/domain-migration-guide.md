# Domain Migration Guide: Pointing Hostinger Domain to Vercel

This guide walks you through configuring your Hostinger-registered domain to point to your Vercel deployment while keeping the domain registered with Hostinger.

## Overview

**What we're doing:** Updating DNS records so your domain points to Vercel's servers instead of Hostinger's hosting.

**Time required:** 15-30 minutes of work + 24-48 hours for DNS propagation

**Downtime:** Minimal if done correctly (DNS propagation is gradual)

---

## Prerequisites

- [ ] Your site is deployed and working on Vercel (e.g., `yourproject.vercel.app`)
- [ ] You have access to your Hostinger account
- [ ] You have access to your Vercel account
- [ ] You know your domain name

---

## Part 1: Add Domain to Vercel

### Step 1: Access Vercel Project Settings

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your deployed project
3. Click on **Settings** in the top navigation
4. Click on **Domains** in the left sidebar

### Step 2: Add Your Custom Domain

1. In the "Domains" section, you'll see an input field
2. Enter your domain name (e.g., `yourdomain.com`)
3. Click **Add**

### Step 3: Add the www Subdomain (Optional but Recommended)

1. In the same input field, add `www.yourdomain.com`
2. Click **Add**
3. Choose whether to redirect `www` to the apex domain or vice versa

### Step 4: Note the DNS Configuration Required

Vercel will show you one of two configuration options:

#### Option A: A Records (Recommended)
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Option B: CNAME Records (Alternative)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

> [!IMPORTANT]
> **Take a screenshot or write down these values** - you'll need them for the next part.

> [!NOTE]
> Vercel may show a warning that the domain is not configured yet - this is expected. We'll fix this in Part 2.

---

## Part 2: Configure DNS at Hostinger

### Step 1: Access Hostinger DNS Management

1. Log in to [Hostinger](https://www.hostinger.com/)
2. Go to **Domains** in the main menu
3. Find your domain in the list and click **Manage**
4. Look for **DNS / Name Servers** or **DNS Zone** section
5. Click on **DNS Zone** or **Manage DNS**

### Step 2: Backup Current DNS Records (Important!)

Before making changes:

1. Take screenshots of all existing DNS records
2. Or copy them to a text file
3. **Especially note any MX records** (for email) and TXT records (for verification)

> [!CAUTION]
> If you have email addresses using this domain (e.g., `you@yourdomain.com`), you MUST preserve the MX records or your email will stop working!

### Step 3: Update/Add A Record for Root Domain

1. Look for an existing **A record** with Name `@` or blank
2. If it exists:
   - Click **Edit** or the pencil icon
   - Change the **Value/Points to** field to: `76.76.21.21`
   - Set **TTL** to `3600` (or leave default)
   - Click **Save**
3. If it doesn't exist:
   - Click **Add Record**
   - **Type:** A
   - **Name:** `@` (or leave blank for root domain)
   - **Value/Points to:** `76.76.21.21`
   - **TTL:** `3600`
   - Click **Save** or **Add Record**

### Step 4: Update/Add CNAME Record for www Subdomain

1. Look for an existing **CNAME record** with Name `www`
2. If it exists:
   - Click **Edit**
   - Change the **Value/Points to** field to: `cname.vercel-dns.com`
   - Click **Save**
3. If it doesn't exist:
   - Click **Add Record**
   - **Type:** CNAME
   - **Name:** `www`
   - **Value/Points to:** `cname.vercel-dns.com`
   - **TTL:** `3600`
   - Click **Save** or **Add Record**

### Step 5: Remove Conflicting Records (If Necessary)

If you see errors or conflicts:

1. Remove any other **A records** pointing to Hostinger's IP addresses
2. Remove any **CNAME records** for `@` (root) that conflict
3. **DO NOT remove:**
   - MX records (email)
   - TXT records (verification, SPF, DKIM)
   - Any records for subdomains you want to keep (e.g., `mail.yourdomain.com`)

### Step 6: Save and Verify

1. Double-check all changes
2. Ensure you have:
   - A record: `@` → `76.76.21.21`
   - CNAME record: `www` → `cname.vercel-dns.com`
   - All MX records intact (if you use email)
3. Click **Save Changes** or **Apply**

---

## Part 3: Verify the Configuration

### Step 1: Wait for DNS Propagation

DNS changes take time to propagate globally:
- **Minimum:** 15-30 minutes
- **Typical:** 2-6 hours
- **Maximum:** 24-48 hours

### Step 2: Check Vercel Dashboard

1. Return to your Vercel project → Settings → Domains
2. Refresh the page periodically
3. Once DNS propagates, you should see:
   - ✅ Green checkmark next to your domain
   - "Valid Configuration" status

### Step 3: Test Your Domain

1. Open a new incognito/private browser window
2. Navigate to `http://yourdomain.com`
3. Navigate to `http://www.yourdomain.com`
4. Both should load your Vercel-deployed site

> [!TIP]
> Use [DNS Checker](https://dnschecker.org/) to see DNS propagation status globally.

### Step 4: Verify HTTPS/SSL

1. Vercel automatically provisions SSL certificates
2. This may take 5-10 minutes after DNS is verified
3. Check that `https://yourdomain.com` works (note the `https`)
4. Vercel will automatically redirect HTTP to HTTPS

---

## Troubleshooting

### Domain Not Verifying in Vercel

**Problem:** Vercel shows "Invalid Configuration" after several hours

**Solutions:**
1. Double-check DNS records in Hostinger match exactly what Vercel requires
2. Clear your browser cache and try again
3. Use `dig yourdomain.com` or `nslookup yourdomain.com` in terminal to check DNS
4. Wait longer - DNS can take up to 48 hours

### Email Stopped Working

**Problem:** Email addresses on your domain stopped receiving mail

**Solution:**
1. Go back to Hostinger DNS settings
2. Ensure all MX records are still present
3. Common Hostinger MX records:
   ```
   Type: MX
   Priority: 10
   Value: mx1.hostinger.com
   
   Type: MX
   Priority: 10
   Value: mx2.hostinger.com
   ```
4. If you deleted them, add them back

### Site Shows Old Hostinger Content

**Problem:** Domain still shows old Hostinger-hosted site

**Solutions:**
1. DNS hasn't propagated yet - wait longer
2. Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Try in incognito/private mode
4. Check DNS with: `dig yourdomain.com` - should show `76.76.21.21`

### SSL Certificate Not Working

**Problem:** Browser shows "Not Secure" or certificate error

**Solutions:**
1. Wait - SSL provisioning can take 10-30 minutes after DNS verification
2. In Vercel, go to Settings → Domains → click "Refresh" next to your domain
3. If it persists after 1 hour, remove and re-add the domain in Vercel

---

## Testing Commands

Run these in your terminal to verify DNS configuration:

```bash
# Check A record for root domain
dig yourdomain.com A

# Should show:
# yourdomain.com.  3600  IN  A  76.76.21.21

# Check CNAME for www
dig www.yourdomain.com CNAME

# Should show:
# www.yourdomain.com.  3600  IN  CNAME  cname.vercel-dns.com.

# Check from multiple DNS servers
dig @8.8.8.8 yourdomain.com  # Google DNS
dig @1.1.1.1 yourdomain.com  # Cloudflare DNS
```

---

## Post-Migration Checklist

After your domain is successfully pointing to Vercel:

- [ ] Test all pages on your site work correctly
- [ ] Verify HTTPS is working (green padlock in browser)
- [ ] Test email (if applicable) - send and receive
- [ ] Update any hardcoded URLs in your code to use the new domain
- [ ] Set up redirects in Vercel if needed (www → non-www or vice versa)
- [ ] Update Google Search Console with new domain
- [ ] Update any social media links
- [ ] Monitor Vercel analytics for traffic

---

## Important Notes

> [!NOTE]
> **Your Hostinger hosting contract:** This DNS change only affects where your domain points. Your Hostinger hosting account remains active. If you're no longer using Hostinger's hosting, you may want to downgrade or cancel that service (but keep the domain registration).

> [!WARNING]
> **Domain renewal:** Your domain is still registered with Hostinger. You'll need to renew it through Hostinger when it expires. Set a reminder!

> [!TIP]
> **Future consideration:** If you want to fully migrate away from Hostinger in the future, you can transfer the domain registration to Vercel or another registrar. This guide keeps things simple by just pointing DNS.

---

## Need Help?

- **Vercel Documentation:** [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- **Hostinger Support:** [DNS Management](https://support.hostinger.com/en/articles/1583227-how-to-manage-dns-records)
- **DNS Propagation Checker:** [https://dnschecker.org/](https://dnschecker.org/)

---

## Summary

1. ✅ Add domain to Vercel project
2. ✅ Get DNS configuration values from Vercel
3. ✅ Update A and CNAME records in Hostinger DNS
4. ✅ Wait for DNS propagation (2-48 hours)
5. ✅ Verify domain works and HTTPS is active
6. ✅ Test all functionality

Your domain will now point to your Vercel deployment while remaining registered with Hostinger!

# Swifty Agency Website User Guide

This guide explains how to use and update the Swifty Agency website without needing technical knowledge.

## Opening The Website

Open the website in your browser. If you are working locally, use:

```txt
http://localhost:3000
```

The public website is what customers see. It includes the main landing page, pricing, portfolio, FAQ, and WhatsApp buttons.

## Using The Public Website

The website has two languages:

- **EN** for English
- **MY** for Malay

Use the **EN / MY** button in the top menu to switch languages.

Visitors can use the menu to jump to:

- Benefits
- About
- Pricing
- Portfolio
- FAQ

The **Get Started on WhatsApp** buttons open WhatsApp so customers can contact the business.

## Opening The Admin Panel

Go to:

```txt
http://localhost:3000/admin/login
```

Sign in using the Firebase admin email and password.

After signing in, you will see the content manager. This is where you update the website.

## Saving Changes

After editing anything, click **Save** in the top-right area of the admin panel.

If you leave the page before saving, your changes may be lost.

## Editing Website Sections

Use the left menu in the admin panel to choose what you want to edit.

### Settings

Use this section to change important site-wide settings.

You can update:

- WhatsApp phone number
- Website colors and theme

You can choose a preset palette or adjust colors manually.

The WhatsApp phone number controls the main WhatsApp buttons and package enquiry buttons. Enter the number with country code and without spaces, for example:

```txt
60123456789
```

### Brand

Use this section to update the website brand name and highlighted brand text.

### Hero

This is the first section visitors see.

You can update:

- Main headline
- Supporting text
- Background image
- Image brightness, contrast, saturation, and blur
- Main WhatsApp button text
- Optional custom CTA link

### Benefits

Use this section to explain why customers should choose the service.

Each benefit has:

- Icon
- Heading
- Description

You can add or remove benefits.

### Company

Use this section to update company information.

You can update:

- Team image
- Company heading
- Company description
- Main statistic
- Client logos

### Pricing

Use this section to manage packages.

Each package can include:

- Package name
- Price
- Original price
- Features
- Optional custom CTA link
- Featured status

You can add or remove packages.

### Portfolio

Use this section to manage portfolio items.

Each item can include:

- Thumbnail image
- TikTok or video link
- Views
- Likes
- Title

You can also use **Fetch TikTok thumbnail** to try to get a thumbnail from a TikTok video link.

### FAQ

Use this section to update common questions and answers.

You can add or remove FAQ items.

### Footer

Use this section to update:

- Footer description
- Address
- Copyright text
- Social media links

## Editing English And Malay Text

Many fields have two boxes:

- **EN** for English
- **MY** for Malay

Update both boxes if you want both language versions to be correct.

If you only update one language, the other language will stay unchanged.

## Uploading Images

For image fields, you can either:

- Paste an image URL, or
- Click **Upload image**

Uploaded images are stored in Firebase Storage.

After uploading an image:

1. Wait for the upload to finish.
2. Check that the preview image appears.
3. Click **Save** to keep the new image on the website.

Images should be clear, relevant, and under 10MB.

## Recommended Image Use

Use real images when possible:

- Hero image: strong brand or content-related visual
- Team image: real team or company photo
- Client logos: clear logo files
- Portfolio thumbnails: actual video or campaign thumbnails

Avoid blurry, dark, stretched, or unrelated images.

## Checking Your Changes

After saving:

1. Open the public website.
2. Refresh the page.
3. Check the section you edited.
4. Switch between English and Malay if you edited both languages.
5. Test buttons and links.

## Signing Out

Click **Sign Out** in the admin panel when you are finished.

## Common Problems

### I cannot log in

Make sure you are using the correct Firebase admin email and password.

If the password is wrong, ask the Firebase project owner to reset it.

### My changes did not appear

Check that you clicked **Save** after editing.

Then refresh the public website.

### My image uploaded but did not stay

After the upload finishes, click **Save**.

Uploading places the image into the form, but saving stores it as the live website content.

### The TikTok thumbnail does not load

Check that the TikTok link is valid and public.

If the automatic thumbnail still fails, upload or paste a thumbnail image manually.

### A button opens the wrong place

For WhatsApp buttons, check the **WhatsApp Phone Number** in **Settings**.

Use the phone number with country code and no spaces, such as:

```txt
60123456789
```

For special non-WhatsApp buttons, check the custom CTA link field in that section.

## Good Editing Habits

- Make small changes and save often.
- Check the public website after important edits.
- Keep both English and Malay content updated.
- Use clear images that match the section.
- Do not share admin login details publicly.
- Sign out after using the admin panel on shared devices.

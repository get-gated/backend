export default `
INSERT INTO public.challenge_templates (id, body, is_enabled, greeting_block, lead_block, donate_block, expected_block, signature_block, created_at, updated_at, name) VALUES ('b4b67f8a-4feb-4ff6-b596-fc361f264212', '<html>
<body>
<p>
%block_greeting%</p>
<p>%block_lead%</p>
<p>%block_donate%</p>
<p>%block_expected%</p>
<p>%block_signature%</p>
<img src="%tracking_pixel%" />
</body>
</html>', false, 'Hello!', 'My inbox is protected by <a href="https://www.gated.com">Gated</a>.', 'To have your message delivered, please <a href="%link_donate%">make a %donation_minimum% to %nonprofit_name%</a>.', 'If I am expecting your email, <a href="%link_expected%">click here</a>.', 'Regards,<br/>
%signature%', '2022-01-12 16:07:36 +00:00', '2022-01-12 16:07:36 +00:00', ' Test template'
)
ON CONFLICT(id) DO NOTHING;

INSERT INTO public.challenge_templates (id, body, is_enabled, greeting_block, lead_block, donate_block, expected_block, signature_block, created_at, updated_at, name) VALUES ('c6eefba6-54d8-416e-ba96-ac4b067dce14', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
    <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
    <meta content="width=device-width" name="viewport"/>
    <!--[if !mso]><!-->
    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
    <!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/>
    <!--<![endif]-->
    <style type="text/css">
    		body {
    			margin: 0;
    			padding: 0;
    		}

    		table,
    		td,
    		tr {
    			vertical-align: top;
    			border-collapse: collapse;
    		}

    		* {
    			line-height: inherit;
    		}

    		a[x-apple-data-detectors=true] {
    			color: inherit !important;
    			text-decoration: none !important;
    		}
    	</style>
    <style id="media-query" type="text/css">
    		@media (max-width: 620px) {

    			.block-grid,
    			.col {
    				min-width: 320px !important;
    				max-width: 100% !important;
    				display: block !important;
    			}

    			.block-grid {
    				width: 100% !important;
    			}

    			.col {
    				width: 100% !important;
    			}

    			.col>div {
    				margin: 0 auto;
    			}

    			img.fullwidth,
    			img.fullwidthOnMobile {
    				max-width: 100% !important;
    			}

    			.no-stack .col {
    				min-width: 0 !important;
    				display: table-cell !important;
    			}

    			.no-stack.two-up .col {
    				width: 50% !important;
    			}

    			.no-stack .col.num4 {
    				width: 33% !important;
    			}

    			.no-stack .col.num8 {
    				width: 66% !important;
    			}

    			.no-stack .col.num4 {
    				width: 33% !important;
    			}

    			.no-stack .col.num3 {
    				width: 25% !important;
    			}

    			.no-stack .col.num6 {
    				width: 50% !important;
    			}

    			.no-stack .col.num9 {
    				width: 75% !important;
    			}

    			.video-block {
    				max-width: none !important;
    			}

    			.mobile_hide {
    				min-height: 0px;
    				max-height: 0px;
    				max-width: 0px;
    				display: none;
    				overflow: hidden;
    				font-size: 0px;
    			}

    			.desktop_hide {
    				display: block !important;
    				max-height: none !important;
    			}
    		}
    	</style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #e2eace;">
    <!--[if IE]><div class="ie-browser"><![endif]-->
    <table bgcolor="#e2eace" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e2eace; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td style="word-break: break-word; vertical-align: top;" valign="top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#e2eace"><![endif]-->
    <div style="background-color:#f0efef;">
    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efef;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
    <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <div align="center" class="img-container center fullwidth" style="padding-right: 0px;padding-left: 0px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
    <div style="font-size:1px;line-height:25px"> </div><img align="center" alt="Image" border="0" class="center fullwidth" src="https://assets.website-files.com/5f07da5068dbeaee10147b5f/5f73cc84ddda8db8525f0b42_rounder-up.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 600px; display: block;" title="Image" width="600"/>
    <!--[if mso]></td></tr></table><![endif]-->
    </div>
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:#f0efef;">
    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efef;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#FFFFFF;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <div align="center" class="img-container center" style="padding-right: 0px;padding-left: 0px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center" src="https://assets.website-files.com/5f07da5068dbeaee10147b5f/5f2c3ed831b8a128049d91c8_gated.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 150px; display: block;" title="Image" width="150"/>
    <!--[if mso]></td></tr></table><![endif]-->
    </div>
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 15px; padding-top: 15px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
    <div style="color:#0D0D0D;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.2;padding-top:15px;padding-right:10px;padding-bottom:10px;padding-left:15px;">
    <div style="font-size: 12px; line-height: 1.2; color: #0D0D0D; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14px;">
    <p style="font-size: 28px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 34px; margin: 0;"><span style="font-size: 28px;"><strong>%block_greeting%</strong></span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.5;padding-top:10px;padding-right:15px;padding-bottom:10px;padding-left:15px;">
    <div style="font-size: 12px; line-height: 1.5; color: #555555; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px;">
    <p style="font-size: 14px; line-height: 1.5; word-break: break-word; text-align: left; mso-line-height-alt: 21px; margin: 0;">%block_lead%</p>
    <p style="font-size: 14px; line-height: 1.5; word-break: break-word; text-align: left; mso-line-height-alt: 21px; margin: 0;"> </p>
    <p style="font-size: 14px; line-height: 1.5; word-break: break-word; text-align: left; mso-line-height-alt: 21px; margin: 0;">%block_donate%</p>
    </div>
    </div>
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:#f0efef;">
    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efef;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#ffffff;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.5;padding-top:10px;padding-right:15px;padding-bottom:10px;padding-left:15px;">
    <div style="font-size: 12px; line-height: 1.5; color: #555555; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px;">
    <p style="font-size: 14px; line-height: 1.5; word-break: break-word; text-align: left; mso-line-height-alt: 21px; margin: 0;">%block_expected%.</p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:#f0efef;">
    <div class="block-grid mixed-two-up" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efef;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="150" style="background-color:#ffffff;width:150px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 150px; width: 150px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center autowidth" src="https://assets.website-files.com/5f07da5068dbeaee10147b5f/5f73cc84ddda8dd4a85f0b43_shutterstock_1444898876-p-1600.jpeg" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 150px; display: block;" title="Alternate text" width="150"/>
    <!--[if mso]></td></tr></table><![endif]-->
    </div>
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td><td align="center" width="450" style="background-color:#ffffff;width:450px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num9" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 450px; width: 450px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:20px;">
    <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14px;">
    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="color: #3c80ff;"><strong><span style="font-size: 24px;">What is Gated?</span></strong></span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.5;padding-top:10px;padding-right:15px;padding-bottom:10px;padding-left:20px;">
    <div style="line-height: 1.5; font-size: 12px; color: #555555; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px;">
    <p style="font-size: 14px; line-height: 1.5; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">Gated is a free, simple, and secure email filter I use to reduce the noise in my inbox, while allowing people I don''t know to reach me by making a donation to charity. </p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:#f0efef;">
    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efef;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#FFFFFF;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:10px;"><![endif]-->
    <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.gated.email/" style="height:31.5pt; width:235.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3c80ff"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px"><![endif]--><a href="https://www.gated.email/" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #3c80ff; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #3c80ff; border-right: 1px solid #3c80ff; border-bottom: 1px solid #3c80ff; border-left: 1px solid #3c80ff; padding-top: 5px; padding-bottom: 5px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">LEARN MORE ABOUT GATED</span></span></a>
    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
    </div>
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:#f0efef;">
    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #525252;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#525252;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efef;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#525252"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#525252;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14px;">
    <p style="font-size: 12px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 14px; margin: 0;"><span style="color: #ffffff; font-size: 12px;">%block_signature%</span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:#f0efef;">
    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efef;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <div align="center" class="img-container center fullwidth" style="padding-right: 0px;padding-left: 0px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center fullwidth" src="https://assets.website-files.com/5f07da5068dbeaee10147b5f/5f73cc844937c821b1e54c00_rounder-dwn.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 600px; display: block;" title="Image" width="600"/>
    <!--[if mso]></td></tr></table><![endif]-->
    </div>
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 30px; padding-right: 30px; padding-bottom: 30px; padding-left: 30px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
    </tr>
    </tbody>
    </table>
    <img src="%viewPixel%"></img>
    <!--[if (IE)]></div><![endif]-->
    </body>
    </html>', false, 'Oh, hello there!', 'It looks like I haven''t communicated with this email address before, so your message was diverted from my inbox.', 'But... you can help your email reach me by clicking the button below to donate $%donation_minimum% to a charity of my choosing: %nonprofit_name%.
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="%link_donate%" style="height:31.5pt; width:235.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3c80ff"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px"><![endif]--><a href="%link_donate%" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #3c80ff; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #3c80ff; border-right: 1px solid #3c80ff; border-bottom: 1px solid #3c80ff; border-left: 1px solid #3c80ff; padding-top: 5px; padding-bottom: 5px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">DONATE TO REACH MY INBOX</span></span></a>', 'If you know me personally, but are sending from an unknown email address, please <a href="%link_expected%" rel="noopener" style="text-decoration: underline; color: #3aaee0;" target="_blank">click here</a>', '%signature%', '2022-02-25 21:37:55 +00:00', '2022-02-25 21:37:55 +00:00', 'Default'
)
ON CONFLICT(id) DO NOTHING;

INSERT INTO public.challenge_templates (id, body, is_enabled, greeting_block, lead_block, donate_block, expected_block, signature_block, created_at, updated_at, name) VALUES ('5a6024ca-a054-448b-8af4-922d85ea5415', '<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Email</title>

    <style type="text/css">
        @media all and (max-width: 600px;) {
            .pad {padding-left: 5px !important; padding-right: 5px !important;}
            .top_pad {padding-top: 0 !important;}
            .pic_holder {padding-bottom: 20px;}
        }
    </style>

    <!--[if mso]>
    <style>
        body,table tr,table td,a, span,table.MsoNormalTable {
            font-family: ''Epilogue'', system-ui, ''Segoe UI'', Arial, sans-serif !important;
            font-size: 13px;
            line-height: 24px;
        }
        .footer_link {font-size: 12px !important;}
    </style>
    <![endif]-->
</head>

<body>
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="
    border-collapse: collapse;
    background-color: #ffffff;
    color: #353535;
    font-family: ''Roboto'', system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', ''Helvetica Neue'', Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 20px;
">
    <tr>
        <td class="top_pad" style="
            padding-top: 20px;
            padding-bottom: 30px;
        ">
            <table align="left" border="0" cellpadding="0" cellspacing="0" style="
            border-collapse: collapse;
            background-color: #ffffff;
            width: auto;
            ">
                <tr>
                    <td class="pad" style="
                    padding-left: 20px;
                    padding-right: 20px;
                    padding-top: 0px;
                    padding-bottom: 10px;
                    ">


  <p style="margin-bottom: 15px;">
    %block_greeting%
<br>
<br>I''m using a new, intelligent email solution called <b><a href="https://gated.com?utm_channel=bodytext_link&utm_source=email&utm_campaign=challengeemail_2109">Gated</a></b> to help reduce noise in my inbox while also benefiting charity.
  </p>
  <p style="margin-bottom: 15px;">
    %block_lead%
  </p>
  <ul style="padding:0; padding-left:40px">
  
  <li>
      <p>
        %block_donate%
      </p>
    </li>
    <li>
      <p>
        %block_expected% 
      </p>
    </li>
    

  </ul>

  <p style="margin-top: 0; margin-bottom: 15px;">
    I look forward to hearing from you.
  </p>
  <p style="margin-top: 20px; margin-bottom: 20px;">
    %block_signature%
  </p>
  <br>
  <hr>

  </table>
 
 <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="
    border-collapse: collapse;
    background-color: #ffffff;
    color: #353535;
    font-family: ''Roboto'', system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', ''Helvetica Neue'', Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 20px;
">
<tr>
        <td class="top_pad" style="
            padding-top: 0px;
            padding-bottom: 0px;
        ">
  <a href="https://www.gated.com?utm_channel=footer_link&utm_source=email&utm_campaign=challengeemail_2109"><img src="https://storage.googleapis.com/app.gated.email/bottom_logo.png" style="display: block; margin-left: 20px; margin-right: 20px;" align="left" alt="Gated" width="225" height="16" /></a>
  </tr>
  </td>
  </table>

<img src="%tracking_pixel%" />
</body>

</html>', false, 'Hi! ', 'I don''t recognize your email address, so you''ll need to take one simple step in order for your message to reach me:', 'When you donate, your message will be delivered to my inbox. I can''t guarantee a reply, but I''ll be notified of the donation and will read your email <b><a href="%link_donate%?utm_channel=donation_link&utm_source=email&utm_campaign=challengeemail_2109">Click here to donate %donation_minimum%</a> to support my charity of choice,
          %nonprofit_name%.</b>', 'If you know me personally <b><a href="%link_expected%?utm_channel=sv_link&utm_source=email&utm_campaign=challengeemail_2109">click here to deliver your message</a></b>.', '%signature%', '2022-03-02 19:43:38 +00:00', '2022-03-02 19:43:38 +00:00', '21-09 Clean Design'
)
ON CONFLICT(id) DO NOTHING;

INSERT INTO public.challenge_templates (id, body, is_enabled, greeting_block, lead_block, donate_block, expected_block, signature_block, created_at, updated_at, name) VALUES ('22b7ac29-97e8-44b9-b5d5-c318505652c3', '<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Email</title>

    <style type="text/css">
        @media all and (max-width: 600px;) {
            .pad {padding-left: 5px !important; padding-right: 5px !important;}
            .top_pad {padding-top: 0 !important;}
            .pic_holder {padding-bottom: 20px;}
        }
    </style>

    <!--[if mso]>
    <style>
        body,table tr,table td,a, span,table.MsoNormalTable {
            font-family: ''Epilogue'', system-ui, ''Segoe UI'', Arial, sans-serif !important;
            font-size: 13px;
            line-height: 24px;
        }
        .footer_link {font-size: 12px !important;}
    </style>
    <![endif]-->
</head>

<body>
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="
    border-collapse: collapse;
    background-color: #ffffff;
    color: #353535;
    font-family: ''Roboto'', system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', ''Helvetica Neue'', Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 20px;
">
    <tr>
        <td class="top_pad" style="
            padding-top: 20px;
            padding-bottom: 30px;
        ">
            <table align="left" border="0" cellpadding="0" cellspacing="0" style="
            border-collapse: collapse;
            background-color: #ffffff;
            width: auto;
            ">
                <tr>
                    <td class="pad" style="
                    padding-left: 20px;
                    padding-right: 20px;
                    padding-top: 0px;
                    padding-bottom: 10px;
                    ">


  <p style="margin-bottom: 15px;">
    %block_greeting%
    
  </p>
  <p style="margin-bottom: 15px;">
    %block_lead%
  </p>
  <ul style="padding:0; padding-left:40px">
  
      <li>
      <p>
        %block_expected% <b><a href="%link_expected%">click here to deliver your message</a></b>.
      </p>
    </li>
<li>
<p>
If you''re a founder seeking to pitch to Precursor Ventures, <b>please review our <a href="https://precursorvc.notion.site/precursorvc/Precursor-Ventures-Investment-Criteria-c9e369d7a6fa4153badd24175ea29597">Investment Criteria</a> and then fill out <a href="https://precursorvc.com/startup/">this quick form</a></b> and we’ll get back to you as soon as possible (typically within 2 weeks).
</p>
</li>
<li>
      <p>
        <b>Everyone else is invited to <a href="%link_donate%">click here to donate $%donation_minimum%</a> to support my charity of choice,
          %nonprofit_name%.</b> %block_donate%.
      </p>
    </li>

    

  </ul>

  <p style="margin-top: 0; margin-bottom: 15px;">
    I look forward to hearing from you.
  </p>
  <p style="margin-top: 20px; margin-bottom: 20px;">
    %block_signature%
  </p>
  <br>
  <hr>

  </table>
 
 <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="
    border-collapse: collapse;
    background-color: #ffffff;
    color: #353535;
    font-family: ''Roboto'', system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', ''Helvetica Neue'', Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 20px;
">
<tr>
        <td class="top_pad" style="
            padding-top: 0px;
            padding-bottom: 0px;
        ">
  <a href="https://www.gated.com?utm_source=sign-ups&utm_medium=email"><img src="https://storage.googleapis.com/app.gated.email/bottom_logo.png" style="display: block; margin-left: 20px; margin-right: 20px;" align="left" alt="Gated" width="225" height="16" /></a>
  </tr>
  </td>
  </table>

<img src="%tracking_pixel%" />
</body>

</html>', false, 'Hi!
<br>
<br> I''m trying out a new, intelligent email solution called <a href="https://www.gated.com">Gated</a> (a <a href="https://precursorvc.com/">Precursor Ventures</a> company) to help reduce noise in my inbox while also benefiting charity. I don''t recognize your email address so please read below to see how to reach to me.', ' ', 'When you donate, your message will be delivered to my inbox. I can''t guarantee a reply, but I''ll be notified of the donation and will read your email', 'If you know me personally but are emailing from a new address, please', '%signature%', '2022-03-14 16:16:30 +00:00', '2022-03-14 16:16:30 +00:00', 'Custom Template - Charles Hudson'
)
ON CONFLICT(id) DO NOTHING;

INSERT INTO public.challenge_templates (id, body, is_enabled, greeting_block, lead_block, donate_block, expected_block, signature_block, created_at, updated_at, name) VALUES ('9d0bfd0c-83c0-431a-af03-a367b4cfd6c0', '<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Email</title>

    <style type="text/css">
        @media all and (max-width: 600px;) {
            .pad {padding-left: 5px !important; padding-right: 5px !important;}
            .top_pad {padding-top: 0 !important;}
            .pic_holder {padding-bottom: 20px;}
        }
    </style>

    <!--[if mso]>
    <style>
        body,table tr,table td,a, span,table.MsoNormalTable {
            font-family: ''Epilogue'', system-ui, ''Segoe UI'', Arial, sans-serif !important;
            font-size: 13px;
            line-height: 24px;
        }
        .footer_link {font-size: 12px !important;}
    </style>
    <![endif]-->
</head>

<body>
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="
    border-collapse: collapse;
    background-color: #ffffff;
    color: #353535;
    font-family: ''Roboto'', system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', ''Helvetica Neue'', Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 20px;
">
    <tr>
        <td class="top_pad" style="
            padding-top: 20px;
            padding-bottom: 30px;
        ">
            <table align="left" border="0" cellpadding="0" cellspacing="0" style="
            border-collapse: collapse;
            background-color: #ffffff;
            width: auto;
            ">
                <tr>
                    <td class="pad" style="
                    padding-left: 20px;
                    padding-right: 20px;
                    padding-top: 0px;
                    padding-bottom: 10px;
                    ">


  <p style="margin-bottom: 15px;">
    %block_greeting%
    
  </p>
  <p style="margin-bottom: 15px;">
    %block_lead%
  </p>

  
  
      <p>
       If you would like your email to reach me personally, please kindly <b><a href="%link_donate%">click here to donate $%donation_minimum%</a> to support my charity of choice,
          %nonprofit_name%.</b> %block_donate%.
      </p>
   

      <p>
        %block_expected% <b><a href="%link_expected%">click here to deliver your message</a></b>.
      </p>
    
    



  <p style="margin-top: 0; margin-bottom: 15px;">
    I look forward to hearing from you.
  </p>
  <p style="margin-top: 20px; margin-bottom: 20px;">
    %block_signature%
  </p>
  <br>
  <hr>

  </table>
 


<img src="%tracking_pixel%" />
</body>

</html>', false, 'Hello, and thank you for your email! 
<br>
<br>As a busy executive, I receive a lot of unsolicited emails from a variety of companies.', 'You are receiving this message because my system does not recognize your email address.', 'You are helping a great organization when you donate, AND your message will then be delivered to my inbox. I cannot guarantee a reply, but I will read your email. If you choose not to donate, please have a nice day.', 'If you know me personally and are sending a message from an unknown email address,', '%signature%', '2022-03-14 16:33:43 +00:00', '2022-03-14 16:33:43 +00:00', 'Custom Template - Girish Jashnani'
)
ON CONFLICT(id) DO NOTHING;

INSERT INTO public.challenge_templates (id, body, is_enabled, greeting_block, lead_block, donate_block, expected_block, signature_block, created_at, updated_at, name) VALUES ('c52af3f8-c47b-4287-a83f-16b4b9e1c4b4', '<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Email</title>

    <style type="text/css">
        @media all and (max-width: 600px;) {
            .pad {padding-left: 5px !important; padding-right: 5px !important;}
            .top_pad {padding-top: 0 !important;}
            .pic_holder {padding-bottom: 20px;}
        }
    </style>

    <!--[if mso]>
    <style>
        body,table tr,table td,a, span,table.MsoNormalTable {
            font-family: ''Epilogue'', system-ui, ''Segoe UI'', Arial, sans-serif !important;
            font-size: 13px;
            line-height: 24px;
        }
        .footer_link {font-size: 12px !important;}
    </style>
    <![endif]-->
</head>

<body>
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="
    border-collapse: collapse;
    background-color: #ffffff;
    color: #353535;
    font-family: ''Roboto'', system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', ''Helvetica Neue'', Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 20px;
">
    <tr>
        <td class="top_pad" style="
            padding-top: 20px;
            padding-bottom: 30px;
        ">
            <table align="left" border="0" cellpadding="0" cellspacing="0" style="
            border-collapse: collapse;
            background-color: #ffffff;
            width: auto;
            ">
                <tr>
                    <td class="pad" style="
                    padding-left: 20px;
                    padding-right: 20px;
                    padding-top: 0px;
                    padding-bottom: 10px;
                    ">


  <p style="margin-bottom: 15px;">
    %block_greeting%
  </p>
  <p style="margin-bottom: 15px;">
    %block_lead%
  </p>
  <ul style="padding:0; padding-left:40px">
  
  <li>
      <p>
        %block_donate%
      </p>
    </li>
    <li>
      <p>
        %block_expected% 
      </p>
    </li>
    

  </ul>

  <p style="margin-top: 0; margin-bottom: 15px;">
    I look forward to hearing from you.
  </p>
  <p style="margin-top: 20px; margin-bottom: 20px;">
    %block_signature%
  </p>
  <br>
  <hr>

  </table>
 
 <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="
    border-collapse: collapse;
    background-color: #ffffff;
    color: #353535;
    font-family: ''Roboto'', system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', ''Helvetica Neue'', Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 20px;
">
<tr>
        <td class="top_pad" style="
            padding-top: 0px;
            padding-bottom: 0px;
        ">
  <a href="https://www.gated.com?utm_channel=footer_link&utm_source=email&utm_campaign=challengeemail_2109"><img src="https://storage.googleapis.com/app.gated.email/bottom_logo.png" style="display: block; margin-left: 20px; margin-right: 20px;" align="left" alt="Gated" width="225" height="16" /></a>
  </tr>
  </td>
  </table>

<img src="%tracking_pixel%" />
</body>

</html>', true, 'Hi! 
<br>
<br>I''m using a new, intelligent email solution called <b><a href="https://gated.com?utm_channel=bodytext_link&utm_source=email&utm_campaign=challengeemail_2109">Gated</a></b> to help reduce noise in my inbox while also benefiting charity.', 'I don''t recognize your email address, so you''ll need to take one simple step in order for your message to reach me:', 'When you donate, your message will be delivered to my inbox. I can''t guarantee a reply, but I''ll be notified of the donation and will read your email <b><a href="%link_donate%?utm_channel=donation_link&utm_source=email&utm_campaign=challengeemail_2109">Click here to donate %donation_minimum%</a> </b> to support my charity of choice,
       <b> %nonprofit_name%.</b>', 'If you know me personally <b><a href="%link_expected%?utm_channel=sv_link&utm_source=email&utm_campaign=challengeemail_2109">click here to deliver your message</a></b>.', '%signature%', '2022-03-31 20:17:16 +00:00', '2022-03-31 20:17:16 +00:00', '21-09 Clean Design - fixed headers'
) ON CONFLICT(ID) DO NOTHING;
`;

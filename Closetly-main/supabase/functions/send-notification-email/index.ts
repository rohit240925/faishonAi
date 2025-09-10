import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// Add Deno type declarations at the top
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*", // DO NOT CHANGE THIS
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*" // DO NOT CHANGE THIS
      }
    });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    const { email, subject, template, data } = await req.json();
    
    if (!email || !subject || !template) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: email, subject, template'
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // Email templates for FashionGen
    const emailTemplates = {
      welcome: {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to FashionGen! 🎨</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; margin-top: 0;">Hello ${data?.name || 'Fashion Enthusiast'}!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for joining FashionGen - your AI-powered virtual wardrobe is now ready! 
                Start creating stunning fashion looks with our advanced AI technology.
              </p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Your Plan: ${data?.planName || 'Basic'}</h3>
                <p style="color: #666; margin: 0;">
                  Monthly API Credits: ${data?.monthlyCredits || '1000'}<br>
                  Storage Limit: ${data?.storageLimit || '1GB'}
                </p>
              </div>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Ready to get started? Upload a photo and let our AI create amazing fashion overlays for you!
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data?.loginUrl || '#'}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Start Creating →
                </a>
              </div>
            </div>
          </div>
        `,
        text: `Welcome to FashionGen! Your AI-powered virtual wardrobe is ready. Plan: ${data?.planName || 'Basic'}, Monthly Credits: ${data?.monthlyCredits || '1000'}.`
      },
      subscription_changed: {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Subscription Updated</h2>
            <p>Your FashionGen subscription has been updated to: <strong>${data?.newPlan || 'Unknown'}</strong></p>
            <p>New monthly API credits: <strong>${data?.newCredits || 'N/A'}</strong></p>
            <p>Changes will take effect: <strong>${data?.effectiveDate || 'Immediately'}</strong></p>
          </div>
        `,
        text: `Your FashionGen subscription has been updated to: ${data?.newPlan || 'Unknown'}. New monthly API credits: ${data?.newCredits || 'N/A'}.`
      },
      credit_recharge: {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">API Credits Recharged</h2>
            <p>Your FashionGen account has been recharged with <strong>${data?.credits || 0} API credits</strong>.</p>
            <p>Amount paid: <strong>$${data?.amount || '0.00'}</strong></p>
            ${data?.discount ? `<p>Discount applied: <strong>${data.discount}%</strong></p>` : ''}
            <p>Your current balance: <strong>${data?.newBalance || 'N/A'} credits</strong></p>
          </div>
        `,
        text: `Your FashionGen account has been recharged with ${data?.credits || 0} API credits. Amount paid: $${data?.amount || '0.00'}.`
      },
      storage_warning: {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #ff6b35;">Storage Limit Warning</h2>
            <p>Your FashionGen storage is almost full!</p>
            <p>Current usage: <strong>${data?.usedStorage || 'N/A'}</strong> of <strong>${data?.totalStorage || '1GB'}</strong></p>
            <p>Consider upgrading to a higher tier for more storage space.</p>
          </div>
        `,
        text: `Storage warning: Your FashionGen storage is ${data?.usedStorage || 'N/A'} of ${data?.totalStorage || '1GB'} used.`
      }
    };
    
    const selectedTemplate = emailTemplates[template as keyof typeof emailTemplates];
    if (!selectedTemplate) {
      throw new Error(`Template '${template}' not found`);
    }
    
    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [email],
        subject: subject,
        html: selectedTemplate.html,
        text: selectedTemplate.text
      })
    });
    
    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      throw new Error(`Resend API error: ${error}`);
    }
    
    const emailResult = await emailResponse.json();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      id: emailResult.id
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});
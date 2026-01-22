export function getEmailHeader() {
  return `
    <div style="background-color: #000; padding: 30px; text-align: center; border-bottom: 4px solid #b6ff40;">
      <h1 style="color: #b6ff40; margin: 0; font-family: 'Inter', sans-serif; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; font-size: 32px;">
        Easy US <span style="color: #fff;">LLC</span>
      </h1>
    </div>
  `;
}

export function getEmailFooter() {
  return `
    <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee; color: #666; font-family: 'Inter', sans-serif;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #000; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Expertos en formación de LLC</p>
      <p style="margin: 0; font-size: 14px;">New Mexico, USA | info@easyusllc.com</p>
      <div style="margin-top: 20px;">
        <a href="https://wa.me/34614916910" style="color: #000; text-decoration: none; font-weight: bold; margin: 0 10px;">WhatsApp</a>
        <a href="https://easyusllc.com" style="color: #000; text-decoration: none; font-weight: bold; margin: 0 10px;">Web</a>
      </div>
    </div>
  `;
}

export function getOtpEmailTemplate(otp: string) {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; color: #1a1a1a;">
      ${getEmailHeader()}
      <div style="padding: 40px; background-color: #ffffff;">
        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; tracking: -0.5px;">Verifica tu identidad</h2>
        <p style="line-height: 1.6; font-size: 16px; color: #444;">Para continuar con la formación de tu LLC, por favor utiliza el siguiente código de verificación:</p>
        
        <div style="background: #f1f5f9; padding: 30px; border-radius: 16px; margin: 30px 0; text-align: center; border: 2px dashed #cbd5e1;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Tu código es:</p>
          <p style="margin: 0; font-size: 42px; font-weight: 900; color: #000; letter-spacing: 8px;">${otp}</p>
        </div>

        <p style="line-height: 1.6; font-size: 14px; color: #666; font-style: italic;">Este código caducará en 10 minutos por motivos de seguridad.</p>
      </div>
      ${getEmailFooter()}
    </div>
  `;
}

export function getWelcomeEmailTemplate(name: string) {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; color: #1a1a1a;">
      ${getEmailHeader()}
      <div style="padding: 40px; background-color: #ffffff;">
        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; tracking: -0.5px;">¡Bienvenido, ${name}!</h2>
        <p style="line-height: 1.6; font-size: 16px; color: #444;">Gracias por confiar en <strong>Easy US LLC</strong> para dar el gran paso hacia el mercado americano.</p>
        
        <p style="line-height: 1.6; font-size: 16px; color: #444;">Hemos recibido tu solicitud y nuestro equipo de expertos ya está revisando toda la información para asegurar que el proceso sea impecable.</p>

        <div style="background: #b6ff40; padding: 25px; border-radius: 16px; margin: 30px 0; text-align: center;">
          <p style="margin: 0; font-size: 18px; font-weight: 800; color: #000;">Tu futuro en USA comienza ahora.</p>
        </div>

        <p style="line-height: 1.6; font-size: 16px; color: #444;">Te mantendremos informado de cada avance. Si tienes cualquier duda, recuerda que tienes soporte prioritario vía WhatsApp.</p>
      </div>
      ${getEmailFooter()}
    </div>
  `;
}

export function getConfirmationEmailTemplate(name: string, requestCode: string) {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; color: #1a1a1a;">
      ${getEmailHeader()}
      <div style="padding: 40px; background-color: #ffffff;">
        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; tracking: -0.5px;">Solicitud Confirmada</h2>
        <p style="line-height: 1.6; font-size: 16px; color: #444;">Hola <strong>${name}</strong>, hemos recibido correctamente tu formulario de aplicación.</p>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 16px; margin: 30px 0; border: 1px solid #eee;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #666; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Referencia de Solicitud:</p>
          <p style="margin: 0; font-size: 22px; font-weight: 900; color: #000;">${requestCode}</p>
        </div>

        <p style="line-height: 1.6; font-size: 16px; color: #444;">Nuestro equipo procesará tu registro oficial en las próximas horas. Recibirás tus documentos constitutivos en tu email en un plazo de 2-3 días hábiles.</p>
      </div>
      ${getEmailFooter()}
    </div>
  `;
}

export function getNewsletterWelcomeTemplate() {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; color: #1a1a1a;">
      ${getEmailHeader()}
      <div style="padding: 40px; background-color: #ffffff;">
        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; tracking: -0.5px;">¡Gracias por suscribirte!</h2>
        <p style="line-height: 1.6; font-size: 16px; color: #444;">Ya eres parte de la comunidad de emprendedores de <strong>Easy US LLC</strong>.</p>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 16px; margin: 30px 0; border: 1px solid #eee;">
          <p style="margin: 0 0 15px 0; font-weight: 800; color: #000; text-transform: uppercase; font-size: 13px;">Lo que recibirás:</p>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #444; font-size: 15px;">
            <li>Tips de optimización fiscal en USA.</li>
            <li>Guías para Mercury y Relay Financial.</li>
            <li>Alertas de cumplimiento (BOI Report).</li>
            <li>Estrategias para negocios digitales.</li>
          </ul>
        </div>

        <p style="line-height: 1.6; font-size: 16px; color: #444;">Bienvenido a bordo.</p>
      </div>
      ${getEmailFooter()}
    </div>
  `;
}

export function getReminderEmailTemplate(name: string, requestCode: string) {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; color: #1a1a1a;">
      ${getEmailHeader()}
      <div style="padding: 40px; background-color: #ffffff;">
        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; tracking: -0.5px;">Termina tu registro</h2>
        <p style="line-height: 1.6; font-size: 16px; color: #444;">Hola <strong>${name}</strong>, hemos notado que aún no has completado los datos para tu nueva LLC.</p>
        
        <div style="background: #f1f5f9; padding: 25px; border-radius: 16px; margin: 30px 0; border: 1px solid #cbd5e1; text-align: center;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Solicitud pendiente:</p>
          <p style="margin: 0; font-size: 24px; font-weight: 900; color: #000;">${requestCode}</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://easyusllc.com/seguimiento" style="background-color: #b6ff40; color: #000; padding: 18px 35px; text-decoration: none; border-radius: 50px; font-weight: 900; display: inline-block; text-transform: uppercase; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(182, 255, 64, 0.3);">Continuar Solicitud</a>
        </div>
      </div>
      ${getEmailFooter()}
    </div>
  `;
}

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ionos.es",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Email credentials missing. Email not sent.");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Easy US LLC" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

import express from 'express'
import { EMAIL_INTEGRAL, EMAIL_PASS_INTEGRAL } from './config.js';
import cors from 'cors'
import nodemailer from 'nodemailer';

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: true}))



//ROUTES
app.get("/", (req, res) => {
    res.send("Server on port 7000");
});

app.post("/sendmailintegral", async (req, res) => {
    const container = [];
    for(let key in req.body){
        if(key === "name_company" || key === "domain_company" || key === "mail_cliente"){
            console.log(key);
        } else {
            container.push(key + ": " + req.body[key]);
        }
    };

    const message = {
        from: EMAIL_INTEGRAL,
        to: req.body.mail_cliente,
        subject: `Un usuario te ha contactado desde el formulario de la web ${req.body.domain_company}`,
        html: `<!DOCTYPE html>
        <html lang="es">
              <head>
                <title>Nuevo contacto</title>
              </head>
              <body style="margin-bottom:20px; margin-top:20px">
                <header>
                  <h1 style="font-weight:bold; font-size:42px; color:#000000">${req.body.name_company}</h1>
                </header>
                <main>
                  <h2 style="margin-top:19px; margin-bottom:13px; text-decoration:underline;">Dejaron los siguientes datos a través del formulario de la web</h2>
                  ${
                    container.map((item) => `<p style="margin:0px; font-size: 16px; color: #000000">${item}</p>`)
                  }
                </main>
              </body>
            </html>`
    };

    const config = {
        service : "gmail",
        host: 'smtp.gmail.com',
        port : 587,
        auth : {
            user: EMAIL_INTEGRAL,
            pass: EMAIL_PASS_INTEGRAL
        }
    };

    const transport = nodemailer.createTransport(config);
    const mailInfo = await transport.sendMail(message);

    if(mailInfo.messageId){
        return res.send(mailInfo);
    } else {
        return res.status(400).send("No se pudo enviar el mail correctamente");
    }
})

export default app;
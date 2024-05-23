
// HTTP biblioteka skirta HTTP serveriams
import http from 'http';
// Failinės sistemos biblioteka skirta darbui su failais
import fs from 'fs';

// Sukuriame serverio objekta
const server=http.createServer((req, res)=>{
    const  method=req.method;
    const url=req.url;
    console.log(`Metodas: ${method}, URL: ${url}`);

    if(url=='/calculate' && method=='POST'){

    // Saugomi duomenu "gabalai"
    const reqBody:any[]=[];
    
    // Funkcija kuri iskvieciama kai gaunamas duomenu gabalas
    req.on('data', (d)=>{
        console.log('Gaunami duomenys');
        console.log(`Duomenys:${d}`);

    // Kiekviena duomenu gabala idedame i masyva
        reqBody.push(d);
    });

    // Funkcija kuri iskvieciama kai baigiami siusti duomenys (visi duomenu gabalai gauti)
    req.on('end', ()=>{
        console.log(`Baigti siusti duomenys`);
    
    // Sujungiame visus gabalus i viena sarasa ir paverciame i stringa
        const reqData=Buffer.concat(reqBody).toString();
        const va=reqData.split('&');
        const x=parseFloat(va[0].split('=')[1]);
        const y=2.54;
        let result1 = (x/y).toFixed(2);

        const c=parseFloat(va[0].split('=')[1]);
        const e=2.54;
        let result2 = (c*e).toFixed(2);

        console.log(`Visi gauti duomenyd:${reqData}`);
        console.log('va');

        res.setHeader("Content-Type", "text/html; charset=utf-8");
            //Nuskaitome failą result.html (į buffer tipo kintamąjį, ir paverčiame į stringą)
            let template=fs.readFileSync('templates/result.html').toString();
            //Pakeičiame tekstą template {{ result }} į suskaičiuotą rezultatą 
            template=template.replace('{{ result1 }}',`Rezultatas: ${result1} inch`);
            template=template.replace('{{ result2 }}',`Rezultatas: ${result2} cm`);
            res.write(template);
            res.end();
                
    });
    return;
    }

    if(url=='/'){
    res.setHeader("Content-Type","text/html; charset=utf-8");
    const template=fs.readFileSync('templates/index.html');
    res.write(template);
    return res.end();
    }

    res.writeHead(404, {
        "Content-Type":"text/html; charset=utf-8",
    });
    const template=fs.readFileSync('templates/404.html');
    res.write(template);
    //req.statusCode=404;
    return res.end();
    
});

server.listen(2999, 'localhost');
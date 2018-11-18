function app_2(){

    function drawGrid(color, stepx, stepy) {
        ctx.save()
        ctx.strokeStyle = color;
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = stepx + 0.5; i < canvas.width; i += stepx) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        for (var i = stepy + 0.5; i < canvas.height; i += stepy) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        ctx.restore();
    }




    var canvas = document.getElementById('canvas_2'),
        ctx = canvas.getContext('2d');
    ctx.font = '13px Helvetica';
    var wChar= ctx.measureText('m').width;


    var RADIO=50,      //radio en cm del ciclotrÃ³n
        escala=(canvas.height-3*wChar)/(2*RADIO),
        orgX=wChar+RADIO*escala,
        orgXX=3*wChar+RADIO*escala,
        orgY=wChar+RADIO*escala,
        orgTexto=2*RADIO*escala+7*wChar,
        orgTray,
//semiperiodo
        sPeriodo,      //   el introducido
        SemiPeriodo,      //el teÃ³rico
//PosiciÃ³n angular, intervalo angular
        angulo=0,
        incAngulo=2,
        anguloCorte=360,         //traza arcos de 5 grados
//tiempo e intervalo de tiempo
        t=0,
        dt,
//polos
        bPoloMas=true,
//sale del ciclotron
        bCorte=false,
//deplazamiento del origen vertical orgY
        dOrgY=0.0,
//puntos de corte
        x=0.0,
        y=0.0,
//parÃ¡metros del ciclotrÃ³n
        indice=0,
        campo=200,       //campo magnÃ©tico en gauss
        ddp=500,         //diferencia de potencial en volts
//masa y carga de las partÃ­culas
        masa=[1, 4, 2, 3, 12, 16],
        carga=[1, 2, 1, 1, 1, 1],
//radio de las Ã³rbitas
        r1=144.482*Math.sqrt(masa[indice]*ddp/carga[indice])/campo,
//energÃ­a final
        energia=0,
        bTermina=false,
        pol=[];


    function ciclotron(g){
//ciclotrÃ³n
        g.strokeStyle='black';
        g.fillStyle='lightgray';
        g.beginPath();
        g.arc(orgX,orgY,RADIO*escala, -Math.PI/2, Math.PI/2, true);
        g.fill();
        g.stroke();
        g.beginPath();
        g.moveTo(orgX, orgY-RADIO*escala);
        g.lineTo(orgX, orgY+RADIO*escala);
        g.stroke();
        g.beginPath();
        g.arc(orgXX,orgY,RADIO*escala, -Math.PI/2, Math.PI/2);
        g.fill();
        g.stroke();
        g.beginPath();
        g.moveTo(orgXX, orgY-RADIO*escala);
        g.lineTo(orgXX, orgY+RADIO*escala);
        g.stroke();

        bornes(g, bPoloMas);

//flechas que indican la direcciÃ³n del campo
        var x1=orgXX+RADIO*escala;
        dibujaFlecha(g, Math.PI/4, x1, canvas.height-4*wChar, 4*wChar,'red');
        g.fillText('B', x1+4*wChar, canvas.height-7*wChar);
        dibujaFlecha(g, 0, x1, canvas.height-4*wChar, 4*wChar, 'blue');
        g.fillText('E', x1+5*wChar, canvas.height-4*wChar);
        dibujaFlecha(g, Math.PI, x1, canvas.height-4*wChar, 4*wChar, 'blue');
        dibujaFlecha(g, 5*Math.PI/4, x1, canvas.height-4*wChar, 4*wChar, 'black');
        dibujaFlecha(g, Math.PI/2, x1, canvas.height-4*wChar, 4*wChar, 'black');
    }


    function bornes(g, bMas){
//polo positivo a la izquierda  azul
        g.font = ' bold 18px Helvetica';
        g.textAlign='center';
        g.textBaseline='middle';
        if(bMas){
            g.fillStyle='red';
            g.beginPath();
            g.arc(orgX, orgY+RADIO*escala+wChar, wChar, 0, 2*Math.PI);
            g.fill();
            g.fillRect(orgX, orgY-RADIO*escala, 2, 2*RADIO*escala);
            g.fillStyle='white';
            g.fillText('+', orgX, orgY+RADIO*escala+wChar);
            g.fillStyle='blue';
            g.beginPath();
            g.arc(orgXX, orgY+RADIO*escala+wChar, wChar,  0, 2*Math.PI);
            g.fill();
            g.fillRect(orgXX, orgY-RADIO*escala, 2, 2*RADIO*escala);
            g.fillStyle='white';
            g.fillText('-', orgXX, orgY+RADIO*escala+wChar);
            dibujaFlecha(g, 0, orgX,  orgY, 2*wChar, 'black');
        }else{
            g.fillStyle='blue';
            g.beginPath();
            g.arc(orgX, orgY+RADIO*escala+wChar, wChar,  0, 2*Math.PI);
            g.fill();
            g.fillRect(orgX, orgY-RADIO*escala, 2, 2*RADIO*escala);
            g.fillStyle='white';
            g.fillText('-', orgX, orgY+RADIO*escala+wChar);
            g.fillStyle='red';
            g.beginPath();
            g.arc(orgXX, orgY+RADIO*escala+wChar, wChar,  0, 2*Math.PI);
            g.fill();
            g.fillRect(orgXX, orgY-RADIO*escala, 2, 2*RADIO*escala);
            g.fillStyle='white';
            g.fillText('+', orgXX, orgY+RADIO*escala+wChar);
            dibujaFlecha(g, Math.PI, orgX+2*wChar,  orgY, 2*wChar, 'black');
        }
        g.font = '13px Helvetica';
    }

    function dibujaFlecha(g, fi, x1, y1, longitud, color){
        if(longitud==0) return;
        var x2=x1+longitud*Math.cos(fi);
        var y2=y1-longitud*Math.sin(fi);
        g.strokeStyle=color;
        g.fillStyle=color;
        //flecha
        g.beginPath();
        g.arc(x1,y1,2,0,2*Math.PI);
        g.fill();
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        var x3=x2-wChar*Math.cos(fi-Math.PI/6);
        var y3=y2+wChar*Math.sin(fi-Math.PI/6);
        g.moveTo(x2, y2);
        g.lineTo(x3, y3);
        x3=x2-wChar*Math.sin(-fi+Math.PI/3);
        y3=y2+wChar*Math.cos(-fi+Math.PI/3);
        g.moveTo(x2, y2);
        g.lineTo(x3, y3);
        g.stroke();
    }


    function trayectoria(g){
        var nVeces=Math.floor(t/SemiPeriodo);
        var r;
        if(angulo==180){
//va a la izquierda
            orgTray=orgX;
            pol.push({x:orgXX,y:orgY+(dOrgY-r1)*escala});
            pol.push({x:orgX,y:orgY+(dOrgY-r1)*escala});
            if((nVeces%2==1) && !bPoloMas){
                energia+=carga[indice]*ddp;
                //dibujaFlecha(g, Math.PI, orgXX,  orgY+(dOrgY-r1)*escala, wChar, 'black');
            }else{
                energia-=carga[indice]*ddp;
                //dibujaFlecha(g, 0, orgX,  orgY+(dOrgY-r1)*escala, wChar, 'black');
            }
            if(energia<=0){
                bTermina=true;
            }
            r=144.482*Math.sqrt(masa[indice]*energia)/carga[indice]/campo;    //radio en cm
//desplazamiento del origen tiende a cero para un nÃºmero grande de vueltas
            dOrgY+=(r-r1);
            r1=r;
            if((r1+Math.abs(dOrgY))>RADIO){
                y=(RADIO*RADIO+dOrgY*dOrgY-r1*r1)/2/dOrgY;
                x=Math.sqrt(RADIO*RADIO-y*y);
                bCorte=true;
                anguloCorte=Math.floor(270+180*Math.atan((y-dOrgY)/x)/Math.PI);
            }
        }

//llega al diÃ¡metro (parte inferior)
        if(angulo==360){
//origen trayectoria a la drecha
            orgTray=orgXX;
            angulo=0;
            pol.push({x:orgXX,y:orgY+(dOrgY+r1)*escala});
            pol.push({x:orgX,y:orgY+(dOrgY+r1)*escala});
            if((nVeces%2==0) && bPoloMas){
                //dibujaFlecha(g, 0, orgX,  orgY+(dOrgY+r1)*escala, wChar, 'black');
                energia+=carga[indice]*ddp;
            }else{
                energia-=carga[indice]*ddp;
                //dibujaFlecha(g, Math.PI, orgXX,  orgY+(dOrgY+r1)*escala, wChar, 'black');
            }
            if(energia<=0){
                bTermina=true;
            }
            r=144.482*Math.sqrt(masa[indice]*energia)/carga[indice]/campo;    //radio en cm
//desplazamiento del origen tiende a cero para un nÃºmero grande de vueltas
            dOrgY-=(r-r1);
            r1=r;
            if((r1+Math.abs(dOrgY))>RADIO){
                y=(RADIO*RADIO+dOrgY*dOrgY-r1*r1)/2/dOrgY;
                x=Math.sqrt(RADIO*RADIO-y*y);
                bCorte=true;
                anguloCorte=Math.floor(90+180*Math.atan((-y+dOrgY)/x)/Math.PI);
            }
        }
//cambia de polaridad
        var resto=t%(2*sPeriodo);
        bPoloMas=false;
        if((resto/(2*sPeriodo))<0.5){
            bPoloMas=true;
        }
        bornes(g, bPoloMas);
        var x1=orgTray-r1*Math.cos(Math.PI/2+angulo*Math.PI/180)*escala;
        var y1=orgY+(dOrgY+r1*Math.sin(Math.PI/2+angulo*Math.PI/180))*escala;
        pol.push({x:x1,y:y1});

        //incrementa el Ã¡ngulo
        angulo+=incAngulo;

        if(bCorte){
            if(angulo>anguloCorte){
                bTermina=true;
//sale por la tangente cuando toca la periferia del ciclotrÃ³n, pone una flecha
                if(anguloCorte>180){
                    dibujaFlecha(g, 3*Math.PI/2+Math.atan2(y-dOrgY,x), orgX-x*escala, orgY+y*escala, 3*wChar, 'red');
                }else{
                    dibujaFlecha(g, Math.PI/2+Math.atan2(dOrgY-y,x), orgXX+x*escala, orgY+y*escala, 3*wChar, 'red');
                }
            }
        }
//dibuja trayectoria
        g.strokeStyle='red';
        g.beginPath();
        g.moveTo(pol[0].x, pol[0].y);
        for(var i=1; i<pol.length; i++){
            g.lineTo(pol[i].x, pol[i].y);
        }
        g.stroke();
        g.fillStyle='red';
        g.beginPath();
        g.arc(x1,y1,2,0, 2*Math.PI);
        g.fill();

    }



    function muestraValores(g){
        g.fillStyle='black';
        g.textAlign='left';
        g.textBaseline='middle';
        g.fillText('radio del ciclotr\u00F3n: '+RADIO+' cm', orgTexto, 2*wChar);
        g.fillText('masa de la part\u00EDcula: '+ masa[indice]+' uma', orgTexto, 4*wChar);
        g.fillText('carga de la part\u00EDcula: '+ carga[indice]+' e', orgTexto, 6*wChar);
    }

    function energiaFinal(g){
//energÃ­a final
        g.textAlign='left';
        g.textBaseline='middle';
        g.fillStyle='red';
        g.fillText('Energ\u00EDa (eV): '+energia, orgTexto, 9*wChar);
        g.fillStyle='blue';
        g.fillText('tiempo(\u03BCs): '+t.toFixed(3), orgTexto, 11*wChar);
    }



    function dispositivo(g){
        ciclotron(g);
        muestraValores(g);
        energiaFinal(g);
    }


    var raf,
        nuevo = document.getElementById('nuevo_2'),
        empieza = document.getElementById('empieza'),
        paso = document.getElementById('paso'),
        pausa=document.getElementById('pausa');

    drawGrid('lightgray', 10, 10);
    dispositivo(ctx);
    empieza.disabled=true;
    pausa.disabled=true;





    nuevo.onclick = function (e) {
        campo=parseFloat(document.getElementById('magnetico_2_1').value);
        ddp=parseFloat(document.getElementById('ddp_2_1').value);
        sPeriodo=parseFloat(document.getElementById('semiperiodo_1').value);
        indice=0;
        var lista=document.getElementById('particulas_2');
        for(var i=0; i<lista.length; i++){
            if(lista[i].selected==true){
                indice=i;
                break;
            }
        }
        energia=0;
        pol.length=0;

        SemiPeriodo=327.904*masa[indice]/campo/carga[indice];
        dt=(incAngulo*SemiPeriodo)/180; //grados por milisegundo
        bPoloMas=true;
        energia=0.0;
        angulo=0;
        anguloCorte=360;
        dOrgY=0.0;
        t=0.0;
        bCorte=false;
//semicircunferencia a la derecha
        r1=144.482*Math.sqrt(masa[indice]*ddp/carga[indice])/campo;    //radio en cm
//fuente de iones
        energia=ddp*carga[indice];
//origen X de la trayectoria
        orgTray=orgXX;
//Contexto grÃ¡fico
        //se sale del ciclotrÃ³n
        bTermina=false;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid('lightgray', 10, 10);
        if(r1>RADIO){
            ciclotron(ctx);
            ctx.textAlign='left';
            ctx.textBaseline='middle';
            ctx.fillText('El radio de la \u00F3rbita', orgTexto, 12*wChar);
            ctx.fillText('es mayor que la del ciclotr\u00F3n', orgTexto, 27*wChar/2);
            return;
        }
        pol.push({x:orgXX,y:orgY+r1*escala});
        pol.push({x:orgX,y:orgY+r1*escala});
        dispositivo(ctx);
        empieza.disabled=false;
        pausa.disabled=true;
        paso.style.display='none';
        pausa.style.display='inline';
        if(raf!=undefined){
            window.cancelAnimationFrame(raf);
        }
    }

    empieza.onclick = function (e) {
        bInicio=false;
        empieza.disabled=true;
        pausa.disabled=false;
        paso.style.display='none';
        pausa.style.display='inline';
        raf=window.requestAnimationFrame(animate);
    }
    pausa.onclick = function (e) {
        empieza.disabled=false;
        pausa.disabled=true;
        paso.style.display='inline';
        pausa.style.display='none';
        window.cancelAnimationFrame(raf);
    }
    paso.onclick = function (e) {
        update();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid('lightgray', 10, 10);
        dispositivo(ctx);
        trayectoria(ctx);
    }


    function update() {
//tiempo
        t+=dt;
    }

    function animate(time) {
        update();
        if (bTermina){
            window.cancelAnimationFrame(raf);
            pausa.disabled=true;
        }else{
            raf=window.requestAnimationFrame(animate);
        }
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid('lightgray', 10, 10);
        dispositivo(ctx);
        trayectoria(ctx);
    }


}
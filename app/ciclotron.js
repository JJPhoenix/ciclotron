function app_1(){



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


    var canvas = document.getElementById('canvas_1'),
        ctx = canvas.getContext('2d');
    ctx.font = '13px Helvetica';
    var wChar= ctx.measureText('m').width;

    var RADIO=50,      //radio en cm del ciclotrÃ³n
        escala=(canvas.height-2*wChar)/(2*RADIO),
        orgX=wChar+RADIO*escala,
        orgXX=4*wChar+RADIO*escala,
        orgY=wChar+RADIO*escala,
        orgTexto=2*RADIO*escala+7*wChar,
//escalas
//nuevo
        bNuevo=false,
//parÃ¡metros del ciclotrÃ³n
        indice=0,
        campo=0,       //campo magnÃ©tico en gauss
        ddp=0,         //diferencia de potencial en volts
//masa y carga de las partÃ­culas
        masa=[1, 4, 2, 3, 12, 16],
        carga=[1, 2, 1, 1, 1, 1],
//energÃ­a final
        energia=0;

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
//ddp alterna
        g.fillStyle='blue';
        g.beginPath();
        g.arc(orgX+3*wChar/2, orgY+RADIO*escala+wChar/2, wChar/2, 0, 2*Math.PI);
        g.fill();
        g.textAlign='center';
        g.textBaseline='middle';
        g.fillStyle='white';
        g.fillText('~', orgX+3*wChar/2, orgY+RADIO*escala+wChar/2);
        g.strokeStyle='black';
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

    function muestraValores(g){
        g.fillStyle='black';
        g.textAlign='left';
        g.textBaseline='middle';
        var str='radio del ciclotr\u00F3n: '+RADIO+' cm';
        g.fillText(str, orgTexto, 2*wChar);
        str='masa de la part\u00EDcula: '+ masa[indice]+' uma';
        g.fillText(str, orgTexto, 4*wChar);
        str='carga de la part\u00EDcula: '+ carga[indice]+' e';
        g.fillText(str, orgTexto, 6*wChar);
    }
    function energiaFinal(g){
//energÃ­a final
        g.textAlign='left';
        g.textBaseline='middle';
        g.fillStyle='red';
        var str='Energ\u00EDa '+energia+' eV';
        g.fillText(str, orgTexto, 8*wChar);
        g.fillStyle='black';
        if(energia==0.0){
            str='El radio de la \u00F3rbita';
            g.fillText(str, orgTexto, 10*wChar);
            str='es mayor que la del ciclotr\u00F3n';
            g.fillText(str, orgTexto, 12*wChar);
        }
    }

    function trayectoria(g){
//primer semiperiodo
        var r, x=0.0, y=0.0, dOrgY=0;
        var angulo=0.0;
        var r1=144.482*Math.sqrt(masa[indice]*ddp/carga[indice])/campo;    //radio en cm
//semicircunferencia hacia la derecha i impar, a la izquierda i par
        var i=1;
        if(r1>RADIO){
            energiaFinal(g);
            return;
        }
//fuente de iones
        g.fillStyle='red';
        g.beginPath();
        g.arc(orgX+wChar/2,  orgY+r1*escala, wChar/2, 0, 2*Math.PI);
        g.fill();
//semicircunferencia a la derecha
        g.strokeStyle='red';
        g.beginPath();
        g.moveTo(orgXX, orgY+r1*escala);
        g.lineTo(orgX, orgY+r1*escala);
        g.stroke();
        g.beginPath();
        g.arc(orgXX,orgY, r1*escala, -Math.PI/2, Math.PI/2);
        g.stroke();
        g.beginPath();
        g.moveTo(orgXX, orgY+dOrgY*escala-r1*escala);
        g.lineTo(orgX, orgY+dOrgY*escala-r1*escala);
        g.stroke();
        energia=carga[indice]*ddp;
        do{
            i++;
//si es impar el signo es negativo
            var sgn=((i%2)==1)? -1:1;
            r=144.482*Math.sqrt(masa[indice]*ddp*i/carga[indice])/campo;    //radio en cm
            energia+=carga[indice]*ddp;
//desplazamiento del origen tiende a cero para un nÃºmero grande de vueltas
            dOrgY+=sgn*(r-r1);
//hay varersecciÃ³n siempre al la izquierda, se sale del ciclotrÃ³n
            if((r+Math.abs(dOrgY))>RADIO){
                y=(RADIO*RADIO+dOrgY*dOrgY-r*r)/2/dOrgY;
                x=Math.sqrt(RADIO*RADIO-y*y);
                angulo=Math.atan2(y-dOrgY,x);
                g.beginPath();
                g.arc(orgX,orgY+(dOrgY*escala),r*escala, -Math.PI/2, -Math.PI-angulo, true);
                g.stroke();
                break;
            }
//no hay varersecciÃ³n
//semicircunferencia a la derecha
            if((i%2)==1){
                g.beginPath();
                g.arc(orgXX,orgY+dOrgY*escala, r*escala, -Math.PI/2, Math.PI/2);
                g.stroke();
                g.beginPath();
                g.moveTo(orgXX, orgY+dOrgY*escala-r*escala);
                g.lineTo(orgX, orgY+dOrgY*escala-r*escala);
                g.stroke();
            }else{
//semicircunferencia a la izquierda
                g.beginPath();
                g.arc(orgX, orgY+dOrgY*escala, r*escala, Math.PI/2, 3*Math.PI/2);
                g.stroke();
                g.beginPath();
                g.moveTo(orgXX, orgY+dOrgY*escala+r*escala);
                g.lineTo(orgX, orgY+dOrgY*escala+r*escala);
                g.stroke();
            }
            r1=r;
        }while(r<RADIO);
//sale por la tangente cuando toca la periferia del ciclotrÃ³n, pone una flecha
        dibujaFlecha(g, 3*Math.PI/2+angulo, orgX-x*escala, orgY+y*escala, 3*wChar, 'red');
        energiaFinal(g);
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

    var nuevo = document.getElementById('nuevo');

    drawGrid('lightgray', 10, 10);
    ciclotron(ctx);


    nuevo.onclick = function (e) {
        campo=parseFloat(document.getElementById('magnetico_1').value);
        ddp=parseFloat(document.getElementById('ddp_1').value);

        indice=0;
        var lista=document.getElementById('particulas');
        for(var i=0; i<lista.length; i++){
            if(lista[i].selected==true){
                indice=i;
                break;
            }
        }
        energia=0;
        bNuevo=true;
        //document.getElementById('readout').innerHTML=indice;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid('lightgray', 10, 10);
        ciclotron(ctx);
        muestraValores(ctx);
        if(bNuevo){
            trayectoria(ctx);
        }
    }


}
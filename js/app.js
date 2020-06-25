

$(document).ready(function(){
    
    //variables para actualizar el score 
    var puntuacion = 0;
    var movimientos = 0;
    var timer = 120000;
    //animacion del titulo del juego
    animacionTituloBlanco($(".main-titulo"));

    //evento para inicilizar el juego
    $(".btn-reinicio").one("click", function () {

        $(this).text("Reiniciar");
        //llamada metodo para inicializar
        game.init();

    });

    //evento para reiniciar el juego
    $(".btn-reinicio").click(function(){
        $(".panel-tablero").fadeIn();
        game.clearBoard();
    });

    

    //objeto game donde se encuentran todas las funciones del juego
    var game = {

        //metodo para inizializar el objeto game
        init: function(){
            //delegacion de evento drag and drop a los objetos candy
            game.dragEvent();
            
            //funcion para refrescar el teblero y sus funciones
            setInterval(() => {
                this.countdown();
                
                this.rellenarTablero($(".col-1"));
                this.rellenarTablero($(".col-2"));
                this.rellenarTablero($(".col-3"));
                this.rellenarTablero($(".col-4"));
                this.rellenarTablero($(".col-5"));
                this.rellenarTablero($(".col-6"));
                this.rellenarTablero($(".col-7"));
                this.matchColummnOfFive();
                this.matchRowOfFive();
                this.matchColummnOfFour();
                this.matchRowOfFour();
                this.matchColummnOfThree();
                this.matchRowOfThree();
                this.removeCandy();
                
            }, 100);

            
        },
        
        //funcion para limpiar el contenido de la partida y regresar el score-borad a su estado inicial
        clearBoard: function(){
            puntuacion = 0;
            movimientos = 0;
            timer = 120000;
            $("[class^='col']").empty();
            $("#score-text").text("0"); 
            $("#timer").text("02:00");
            $(".time").show();
            $("#movimientos-text").text("0");
            $(".panel-score").css("width", "25%");
            $(".titulo-over").detach();
            

        },

        //funcion para llenar tablero con dulces de forma aleatoria 
        rellenarTablero: function(elemento){

            if(elemento.children().length < 7){
                var candy = $("<img class='elemento' src='/image/"+ Math.floor((Math.random() * 4) + 1)+".png'>");            
                candy.css({
                    position: "relative",
                    top: "-700px"
                });
                
                candy.prependTo(elemento);
                //crear droppable a cada dulce
                candy.droppable({
                    scope: "candy"
                     
                });
                //crear draggable a cada dulce
                candy.draggable({
                    scope: "candy",
                    revert: true,
                });
                
                candy.animate({ 
                    top: "0px"
                }, 500);
                

                
            }      
        },

        //metodo utilizado para asignar eventos de drag and drop
        dragEvent: function(){
            var candyBeignReplaced = "";
            var candyBeigndragged = "";
            var typeDragged = "";
            var typeReplaced = "";

            $("[class^=col-]").on("dragstart" , "img", function(){
                candyBeigndragged = $(this);
                typeDragged = $(this).attr("src")
            });

            $("[class^=col-]").on("drag", "img", function(){
                console.log("its being dragged")
            });

            $("[class^=col-]").on("drop", "img", function(){
                candyBeignReplaced = $(this)
                typeReplaced = $(this).attr("src");

                var index = candyBeigndragged.index()
                var down = candyBeignReplaced.is(candyBeigndragged.next());
                var up = candyBeignReplaced.is(candyBeigndragged.prev());
                var right = candyBeignReplaced.is(candyBeigndragged.parent().next().children().get(index));
                var left = candyBeignReplaced.is(candyBeigndragged.parent().prev().children().get(index));

                if(down || up || right || left){
                    candyBeigndragged.attr("src", typeReplaced );
                    candyBeignReplaced.attr("src", typeDragged);
                    movimientos += 1;
                    var textMove = movimientos.toString();
                    $("#movimientos-text").text(textMove);
                }else{
                    candyBeigndragged.attr("src", typeDragged);
                    candyBeignReplaced.attr("src", typeReplaced);
                }
                
            });

            $("[class^=col-]").on("dragstop", "img", function(){     
                console.log("drag end")
            })
        },

        //metodo que permite vizulizar el contador del juego 
        countdown: function(){
            timer -= 100;
            var minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timer % (1000 * 60)) / 1000);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $("#timer").text(minutes+":"+seconds)

            if (timer == 0){
                endOfGame();
            }

        },

        //metodos para verificacion de filas y columnas de dulces
        matchColummnOfThree: function(){
            
            var grid = $(".panel-tablero").find("img");

            if(grid.length == 49){
                for(var i = 0; i < 47; i++){
                    var columna3 = [i, i+1, i+2];
                    var candyType = grid.eq(i).attr("src");
                    var candyVal = grid.eq(i).hasClass("removeCol")
    
                    var skip = [5, 6, 12, 13, 19, 20, 26, 27, 33, 34, 40, 41];
    
                    if(skip.includes(i)) continue
    
    
                    if(columna3.every(index => grid.eq(index).attr("src") == candyType)&& !candyVal){
                        puntuacion += 150;
                        columna3.forEach(index => grid.eq(index).addClass("removeCol"));
                    }
    
                }
            }

        },
        
        matchRowOfThree: function(){
            
            var grid = $(".panel-tablero").find("img");

            if(grid.length == 49){
                for(var i = 0; i < 35; i++){
                    var row3 = [i, i+7, i+14];
                    var candyType = grid.eq(i).attr("src");
                    var candyVal = grid.eq(i).hasClass("removeRow")

    
                    if(row3.every(index => grid.eq(index).attr("src") == candyType)&& !candyVal){
                        puntuacion += 150;
                        row3.forEach(index => grid.eq(index).addClass("removeRow"));
                    }
    
                }
            }

        },

        matchColummnOfFour: function(){
            
            var grid = $(".panel-tablero").find("img");

            if(grid.length == 49){
                for(var i = 0; i < 46; i++){
                    var columna3 = [i, i+1, i+2, i+3];
                    var candyType = grid.eq(i).attr("src");
                    var candyVal = grid.eq(i).hasClass("removeCol")
    
                    var skip = [4, 5, 6, 11, 12, 13, 18, 19, 20, 25, 26, 27, 32, 33, 34, 39, 40, 41];
    
                    if(skip.includes(i)) continue
    
    
                    if(columna3.every(index => grid.eq(index).attr("src") == candyType)&& !candyVal){
                        puntuacion += 300;
                        columna3.forEach(index => grid.eq(index).addClass("removeCol"));
                    }
    
                }
            }

        },

        matchRowOfFour: function(){
            
            var grid = $(".panel-tablero").find("img");

            if(grid.length == 49){
                for(var i = 0; i < 28; i++){
                    var row3 = [i, i+7, i+14, i+21];
                    var candyType = grid.eq(i).attr("src");
                    var candyVal = grid.eq(i).hasClass("removeRow")

    
                    if(row3.every(index => grid.eq(index).attr("src") == candyType)&& !candyVal){
                        puntuacion += 300;
                        row3.forEach(index => grid.eq(index).addClass("removeRow"));
                    }
    
                }
            }

        },

        matchColummnOfFive: function(){
            
            var grid = $(".panel-tablero").find("img");

            if(grid.length == 49){
                for(var i = 0; i < 45; i++){
                    var columna3 = [i, i+1, i+2, i+3, i+4];
                    var candyType = grid.eq(i).attr("src");
                    var candyVal = grid.eq(i).hasClass("removeCol")
    
                    var skip = [3, 4, 5, 6, 10, 11, 12, 13, 17, 18, 19, 20, 24, 25, 26, 27, 31, 32, 33, 34, 38, 39, 40, 41];
    
                    if(skip.includes(i)) continue
    
    
                    if(columna3.every(index => grid.eq(index).attr("src") == candyType)&& !candyVal){
                        puntuacion += 600;
                        columna3.forEach(index => grid.eq(index).addClass("removeCol"));
                    }
    
                }
            }

        },

        matchRowOfFive: function(){
            
            var grid = $(".panel-tablero").find("img");

            if(grid.length == 49){
                for(var i = 0; i < 21; i++){
                    var row3 = [i, i+7, i+14, i+21, i+28];
                    var candyType = grid.eq(i).attr("src");
                    var candyVal = grid.eq(i).hasClass("removeRow")

    
                    if(row3.every(index => grid.eq(index).attr("src") == candyType)&& !candyVal){
                        puntuacion += 600;
                        row3.forEach(index => grid.eq(index).addClass("removeRow"));
                    }
    
                }
            }

        },

        //metodo que permite borrar dulces si se cumplen las condiicones de match 
        removeCandy: function(){
            var grid = $(".panel-tablero").find("img");
            for(var i = 0; i < grid.length; i++){
                if(grid.eq(i).hasClass("removeCol")||grid.eq(i).hasClass("removeRow")){
                    grid.eq(i).animate({
                        opacity: 0.25
                    },{
                        queue: true,
                        duration: 250
                    })

                    .animate({
                        opacity: 1
                    },{
                        queue: true,
                        duration: 250
                    })
                    
                    .animate({
                        opacity: 0.25
                    }, 250, function(){
                        $(this).remove()
                    });
                    ;
                    $("#score-text").text(puntuacion)
                }
            }
        }


   
    }

});


//funciones recursivas de animacion de titulo principal
function animacionTituloBlanco(elemento) {
    
    elemento.animate( {
        color: "white"
    }, {
        queue: true,
        duration: 1000
    })
    .animate({
        color: "yellow"
    }, {
        queue: true,
        duration: 300
    })
    .animate({
        color: "white"
    }, 300, 
    function(){
        animacionTituloAmarillo(elemento)
    });

}; 

function animacionTituloAmarillo(elemento) {

    elemento.animate( {
        color: "yellow"
    }, {
        queue: true,
        duration: 1000
    })
    .animate({
        color: "white"
    }, {
        queue: true,
        duration: 300
    })
    .animate({
        color: "yellow"
    }, 300, function(){
        animacionTituloBlanco(elemento)
    });
    
};

//animacion al finalizar el juego
function endOfGame(){
    $("#timer").text("00:00");
    $(".time").hide();
    $(".panel-tablero").hide("slow")
    $(".panel-score").animate({
        width: "100%"
    }, "slow");

    setTimeout(() => {
        $(".score").parent().prepend("<h1 class='titulo-over'>Juego terminado</h1>")
    }, 800);
    

}




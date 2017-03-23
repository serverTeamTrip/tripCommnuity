(function(){
   var test = document.getElementById("context-menus");

   function init(){
      rightMouseListener();
      leftMouseListener();
   }
   function rightMouseListener(){
      document.addEventListener("contextmenu", function(e){
         event.preventDefault();
         toggleOnOff(1);
         showMenu(e.x, e.y);
      });
   }
   function toggleOnOff(num){
      num === 1? test.classList.add("active") : test.classList.remove("active");
   }
   function showMenu(x, y){
     console.log(test);
    test.style.top = y+"px";
    test.style.left = x + "px";
   }
   init();
})();


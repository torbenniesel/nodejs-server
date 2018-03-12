var startTime = new Date().getTime();
console.log(getTime(),"initial.js executed");
window.addEventListener("initialExecuted", function(){console.log(getTime(),"initialExecuted 1")});
window.addEventListener("initialExecute2", function(){console.log(getTime(),"initialExecuted 2")});

function getTime(){
    return new Date().getTime()-startTime;
}

function pause(milliseconds) {
    var dt = new Date();
    while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
    console.log(getTime(),"pause Finish");
}

function doStuff()
{
    console.log(getTime(),"doStuff() executed");

  setTimeout(continueExecution, 10000) //wait ten seconds before continuing
  pause(5000);
}

function continueExecution()
{
    console.log(getTime(),"doStuff() executed + dispatch Event(initialExecuted)");
    let event = new Event("initialExecuted")
    window.dispatchEvent(event);
}
doStuff();

console.log(getTime(),"Dispatch initialExecuted2")
let e = new Event("initialExecuted2")
window.dispatchEvent(e);
console.log(getTime(),"endOfLineAfterDispatch");



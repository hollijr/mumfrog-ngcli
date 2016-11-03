<?php
$dir = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);
$loc = strripos($dir, '/api');
$path = substr($dir, 0, $loc)."/data/projects.json";

// get the file contents
/*
$jsonobj = [
  [ 'id' => 11, 
    'title' =>  'Gauge Control', 
    'technology' => ['JavaScript', 'HTML5 Canvas'], 
    'summary' => 'A JavaScript object that runs in the HTML5 canvas', 
    'description' => "<p>The gauge control is a JavaScript object that draws to an HTML Canvas.  The canvas element is included as a property in the parameters object that is passed to the Gauge control object at construction.  This object was my first work working with the HTML5 canvas.</p>", 
    'img' => 'assets/images/gauge.png', 
    'componentName' => 'GaugeComponent',
    'component' => null,
    'demo' => `<p>This demo contains a gauge control that runs in the HTML canvas.  There are three ways to see how the gauge works:</p>
    <ul>
    <li>drag the handle on the vertical slider to manually change the input value for the gauge. (I made this slider using the HTML canvas and JavaScript.)</li>
    <li>change the setting of the HTML range control shown below the gauge.  This control's appearance will vary based on your browser.  The range of the control is 0% to 100% of the maximum input value of the gauge.</li>
    <li>click on the 'Start Simulation' button to run a simulation using randomly-generated input values.  The simulation randomly generates a target input value in the gauge's range and moves the gauge needle to that target value.  Once at the target value, a random-length pause occurs (the needle stops moving) followed by the generation of a new target value (so the needle starts moving again).  While the simulation is running, the preceding two manual controls for changing input are inactivated.</li>
    </ul>
    <p>The settings of the control can be modified using the form at the bottom of the page.</p>`,
    'demoLink' =>  '',
    'codeRepo' =>  'https://github.com/hollijr/a-little-control',
    'isFavorite '=>  true 
  ]
];
*/
$jsonobj = file_get_contents($path);
$final_res=json_encode($jsonobj);
echo $final_res;
?>
<?php

echo date("Y-M-D H:m:s");
echo "<br>";
echo intval(microtime(true) * 1000);
echo "<br>";
echo "<script>document.write((new Date()).getTime())</script>";
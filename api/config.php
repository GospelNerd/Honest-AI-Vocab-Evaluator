<?php
$local = __DIR__ . '/config.local.php';
if (!is_readable($local)) {
    return null;
}
return include $local;

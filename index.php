<?php
declare(strict_types=1);
// Main entry point for every page and API route. No Node.js or Composer required.
ini_set('display_errors','0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'");
try {
    if(PHP_VERSION_ID<80200||!extension_loaded('pdo_sqlite')||!extension_loaded('mbstring'))throw new RuntimeException('PHP 8.2+, pdo_sqlite, mbstring required');
    require_once __DIR__.'/app/core.php';
    $app=new \PPES\App(require __DIR__.'/config.php');
    $headers=[];foreach($_SERVER as $key=>$value){if(str_starts_with($key,'HTTP_'))$headers[strtolower(str_replace('_','-',substr($key,5)))]=(string)$value;}
    $headers['content-type']=$_SERVER['CONTENT_TYPE']??'';
    $length=(int)($_SERVER['CONTENT_LENGTH']??0);
    if($length>16*1024*1024){$response=\PPES\Response::json(['error'=>'Размер запроса превышает 16 МБ.'],413);}
    else{
        $multipart=str_starts_with(strtolower($headers['content-type']),'multipart/form-data');
        $body=$multipart?'':file_get_contents('php://input',false,null,0,500001);
        $response=$app->handle($_SERVER['REQUEST_METHOD']??'GET',$_SERVER['REQUEST_URI']??'/',$headers,$body,$_FILES,$_SERVER['REMOTE_ADDR']??'unknown');
    }
    http_response_code($response->status);foreach($response->headers as $name=>$value)header($name.': '.$value);
    if(($_SERVER['REQUEST_METHOD']??'GET')!=='HEAD')echo $response->body;
}catch(Throwable $error){
    error_log('PPES: '.$error->getMessage());
    http_response_code(503);header('Cache-Control: no-store');
    if(str_starts_with($_SERVER['REQUEST_URI']??'','/api/')){header('Content-Type: application/json; charset=utf-8');echo '{"error":"Сервис недоступен. Проверьте настройки PHP и доступ к хранилищу."}';}
    else{header('Content-Type: text/html; charset=utf-8');echo '<!doctype html><html lang="ru"><meta charset="utf-8"><title>Настройка сайта</title><h1>Нужно проверить настройки сервера</h1><p>Откройте INSTALL-PPES.txt из архива. Требуются PHP 8.2 или новее, PDO SQLite, mbstring и доступ на запись в storage.</p><p>Подробности доступны владельцу в журнале PHP.</p></html>';}
}

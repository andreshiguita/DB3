<?php
/**
 * Script de comunicación con servicios de Diebold
 *
 *
 */


define('ROOT_URL_WEBSERVICE', "http://10.175.27.70/");
// define('ROOT_URL_WEBSERVICE', "https://www.diebold.com.co/");

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
$ruta = "";
$nombreArchivo = "log.txt";
$rutaArchivo = $ruta . $nombreArchivo;

$methods = array(
    'RecuperarClave', 'ListarTicketUsuario',
    'OpcionesGestionReparaccion', 'AbrirReparacion', 'CerrarReparacion',
    'DatosTicket', 'RutaTicket', 'ModuloEquipo', 'ModuloEquipoTicket',
    'CodigoProblemaModuloEquipoTicket', 'Causal', 'CodigoCierre',
    'CodigoReparacion', 'CerrarModuloEquipoTicket', 'ParteModuloEquipoTicket',
    'CerrarParteModuloEquipoTicket', 'StatusXMS', 'StatusXMSDetalle',
    'NovedadTicket', 'NovedadSistema', 'BusquedaParte', 'SolicitarParte',
    'RecibeParte', 'MotivoRechazo', 'Rechazar', 'Acepta', 'ArmarAlarma',
    'SeArmoAlarma', 'IngenierosEnZona', 'ServiciosIngeniero', 'CambioIngeniero',
    'ConsultaHojaVidaEquipo', 'CheckList', 'RegistroCheckList', 'AutenticacionIVR',
    'RegistroNovedadSistema', 'RegistroNovedadTicket', 'RegistroPosicion',
    'MarcarNovedadLeida', 'ObtenerNovedad', 'ListarNovedadNoLeidasUsuario',
    'NovedadAlmacen', 'NovedadAlmacenGeneral', 'RegistroNovedad', 'ResponderNovedad', 'ListarNovedadAsignacion',
    'ListarPartesSolicitadas', 'AgregarModulo', 'DevuelvePartes', 'EnTransito',
    'RecibePartes', 'SolicitarPartes', 'ListarActividadesRelacionadas', 'EliminarParteSolicitud',
    'ObtenerActividadRelacionada', 'SolicitarHistorial', 'ResumenCierre', 'ObtenerReparacionModulosVistaPrevia'
);

$params = array();

$method = '';

if (isset($_GET) && is_array($_GET)) {
    foreach ($_GET as $key => $value) {
        if ($key == 'method' && $value !== 'CerrarModuloEquipoTicket') {
            $method = $value;
        } elseif ($key != 'callback') {
            $params[$key] = strip_tags($value);
        }
    }
}

if (isset($_POST) && is_array($_POST)) {
    foreach ($_POST as $key => $value) {
        if ($key == 'method') {
            switch ($value) {
                case 'CerrarModuloEquipoTicket':
                case 'CerrarReparacion':
                case 'Autenticacion':
                case 'RecuperarClave':
                    $method = $value;
                    break;
                default:
                    break;
            }
        } else {
            $params[$key] = strip_tags($value);
        }
    }
}
if(isset($_GET['callback'])){
    if ($method != '') {
        print $_GET['callback'] . '('. getDataMethods($method, $params, $rutaArchivo) . ')';
    } else {
        $error="Método vacío.  Error en la solicitud";
        writeErrorLog($rutaArchivo, $error);
        print $_GET['callback'] . '('. json_encode(array('success' => 'falta metodo')) . ')';
    }
} else {
    if ($method != '') {
        print getDataMethods($method, $params, $rutaArchivo);
    } else {
        $error="Método vacío.  Error en la solicitud";
        writeErrorLog($rutaArchivo, $error);
        print json_encode(array('success' => 'falta metodo'));
    }
}

function getDataMethods($method, $params, $rutaArchivo)
{
    switch ($method) {
        case 'CerrarParteModuloEquipoTicket':
            $params = createXmlModule($params, 'MODULOS', 'MODULO');
            return getDataUniqueMethod($params, $method, array(), 'Result', 'strModuloEquipoTicketCerrados', $rutaArchivo);
            break;
        case 'DevuelvePartes':
            $params = createXmlModule($params, 'PARTES', 'PARTE');
            return getDataUniqueMethod($params, $method, array(), 'Result', 'strPartesDevueltas', $rutaArchivo);
            break;
        case 'RecibePartes':
            $params = createXmlModule($params, 'PARTES', 'PARTE');
            return getDataUniqueMethod($params, $method, array(), 'Result', 'strPartesRecibidas', $rutaArchivo);
            break;
        case 'SolicitarPartes':
            $params = createXmlModule($params, 'PARTES', 'PARTE');
            return getDataUniqueMethod($params, $method, array(), 'Result', 'strPartesSolicitadas', $rutaArchivo);
            break;
        case 'RegistroNovedad':
            $params = createXml($params);
            return getDataUniqueMethod($params, $method, array(), 'Result', 'strNovedadPregunta', $rutaArchivo);
            break;
        case 'ResponderNovedad':
            $params = createXml($params);
            return getDataUniqueMethod($params, $method, array(), 'Result', 'strNovedadRespuesta', $rutaArchivo);
            break;
        case 'Autenticacion':
            return getDataUniqueMethod($params, $method, array(), 'Result', '', $rutaArchivo);
            break;
        case 'RecuperarClave':
            return getDataUniqueMethod($params, $method, array(
                'USUARIOVALIDO', 'CORREOENVIADO'
            ), 'Result', '', $rutaArchivo);
            break;
        case 'ListarTicketUsuario':
        case 'OpcionesGestionReparaccion':
        case 'ModuloEquipoTicket':
        case 'ModuloEquipo':
        case 'RutaTicket':
        case 'CodigoProblemaModuloEquipoTicket':
        case 'Causal':
        case 'CodigoCierre':
        case 'CodigoReparacion':
        case 'ParteModuloEquipoTicket':
        case 'NovedadTicket':
        case 'NovedadSistema':
        case 'BusquedaParte':
        case 'MotivoRechazo':
        case 'IngenierosEnZona':
        case 'ServiciosIngeniero':
        case 'CheckList':
        case 'ListarNovedadAsignacion':
            return getDataMultipleMethod($params, $method, $rutaArchivo);
            break;
        case 'AbrirReparacion':
            $params = formatData($method, $params);
            return getDataUniqueMethod($params, $method, array(), 'Result', '', $rutaArchivo);
            break;
        case 'CerrarReparacion':
            $params = formatData($method, $params);
            return getDataUniqueMethod($params, $method, array(), 'Result', '', $rutaArchivo);
            break;
        case 'DatosTicket':
        case 'StatusXMS':
        case 'SolicitarParte':
        case 'RecibeParte':
        case 'Rechazar':
        case 'Acepta':
        case 'ArmarAlarma':
        case 'SeArmoAlarma':
        case 'CambioIngeniero':
        case 'RegistroCheckList':
        case 'AutenticacionIVR':
        case 'RegistroNovedadSistema':
        case 'RegistroNovedadTicket':
        case 'StatusXMSDetalle':
        case 'RegistroPosicion':
        case 'MarcarNovedadLeida':
        case 'ObtenerNovedad':
        case 'ListarNovedadNoLeidasUsuario':
        case 'NovedadAlmacen':
        case 'NovedadAlmacenGeneral':
        case 'ListarPartesSolicitadas':
        case 'EnTransito':
        case 'AgregarModulo':
        case 'ListarActividadesRelacionadas':
        case 'ObtenerActividadRelacionada':
        case 'SolicitarHistorial':
        case 'ResumenCierre':
        case 'EliminarParteSolicitud':
        case 'ObtenerReparacionModulosVistaPrevia':
            return getDataUniqueMethod($params, $method, array(), 'Result', '', $rutaArchivo);
            break;
        case 'CerrarModuloEquipoTicket':
            if (isset($_FILES) && isset($_FILES['IMAGENDESPUES'])) {
                $handle = fopen($_FILES['IMAGENDESPUES']['tmp_name'], 'rb');
                $contents = fread($handle, filesize($_FILES['IMAGENDESPUES']['tmp_name']));
                fclose($handle);
                $params['IMAGENDESPUES'] = base64_encode($contents);
            }
            $params = createXml($params);
            return getDataUniqueMethod($params, $method, array(), 'Result', 'strCierre', $rutaArchivo);
            break;
        default:
            $error=sprintf("Método '%s' no existe.  Error en la solicitud", $method);
            writeErrorLog($rutaArchivo, $error);
            return json_encode(array('success' => 'Método no existe'));
            break;
    }
}

function getDataUniqueMethod($params, $name, $dataResult, $result="Result", $param='', $rutaArchivo)
{
    $result = $name . $result;
    if ($param != '') {
        $params = array($param => $params);
    }
    try {
        $client = new SoapClient(
            ROOT_URL_WEBSERVICE . "WSDocBase3/WSMovilidad.asmx?WSDL",
            array(
                'soap_version' => SOAP_1_2,
                "features"     => SOAP_SINGLE_ELEMENT_ARRAYS,
                "encoding"     => "utf-8",
                "trace"        => TRUE
        ));
        $autentication = $client->__soapCall(
            $name, array($name => $params)
        );
    } catch (SoapFault $fault) {
        $error = sprintf("Error en la respuesta del WS. Método 1'%s'\n", $name);
        if (isset($fault->faultstring)) {
            $error .= $fault->faultstring;
        }
        writeErrorLog($rutaArchivo, $error);
        $responses = array('success' => 'error');
        $data = json_encode($responses);
        return $data;
    }

    if (!isset($autentication->$result)) {
        $error = sprintf("No viene resultado en el método '%s'\n", $name);
        if (isset($autentication->$name)) {
            $error .= $autentication->$name->any;
        }
        else {
            $resultName = $name . 'Result';
            $error .= $autentication->$resultName->any;
        }
        writeErrorLog($rutaArchivo, $error);
        $responses = array('success' => 'failure');
        $data = json_encode($responses);
        return $data;
    }

    $xml = simplexml_load_string($autentication->$result->any);

    $data = $xml->DATA;

    if (isset($data->FECHAEFECTIVA)) {
        $data->FECHAEFECTIVA = str_replace('/', '-', $data->FECHAEFECTIVA);
    }

    if (isset($data->FECHAGENERACION)) {
        $data->FECHAGENERACION = str_replace('/', '-', $data->FECHAGENERACION);
    }

    $responses = array();
    if (sizeof($dataResult) != 0) {
        foreach ($dataResult as $key => $value) {
            if (isset($data->$value)) {
                $responses[$value] = (string) $data->$value;
            }
        }
    } else {
        $responses = $data;
    }

    if (sizeof($responses) == 0) {
        $error = sprintf("Respuesta vacía.  Método '%s'\n", $name);
        if (isset($autentication->$name)) {
            $error .= $autentication->$name->any;
        }
        else {
            $resultName = $name . 'Result';
            $error .= $autentication->$resultName->any;
        }
        $responses = array('success' => 'respuesta vacia');
    }

    $response = $responses;
    $data = json_encode($response, JSON_FORCE_OBJECT);
    return $data;
}

function getDataMultipleMethod($params, $name, $rutaArchivo)
{
    $result = $name . 'Result';
    try {
        $client = new SoapClient(
            ROOT_URL_WEBSERVICE . "WSDocBase3/WSMovilidad.asmx?WSDL",
            array(
                'soap_version' => SOAP_1_2,
                "features"     => SOAP_SINGLE_ELEMENT_ARRAYS,
                "encoding"     => "utf-8",
                'trace'        => 1,
                'exceptions'   => true
        ));
        $autentication = $client->__soapCall(
            $name, array($name => $params)
        );
    } catch (SoapFault $fault) {
        $error = sprintf("Error en la respuesta del WS. Método '%s'\n", $name);
        if (isset($fault->faultstring)) {
            $error .= $fault->faultstring;
        }
        writeErrorLog($rutaArchivo, $error);
        $responses = array('success' => 'error');
        $data = json_encode($responses, JSON_FORCE_OBJECT);
        return $data;
    }

    if (!isset($autentication->$result)) {
        $error = sprintf("Respuesta vacía.  Método '%s'\n", $name);
        writeErrorLog($rutaArchivo, $error);
        $responses = array('success' => 'respuesta vacia');
        $data = json_encode($responses, JSON_FORCE_OBJECT);
        return $data;
    }

    $xml = simplexml_load_string($autentication->$result->any);
    $data = $xml->DATA;
    $responses = array();
    foreach ($data->children() as $child) {
        if(isset($child->ESTIMADO)){
            $child->ESTIMADO = str_replace('/', '-', $child->ESTIMADO);
        }
        if (isset($child->FECHA)){
            $child->FECHA = str_replace('/', '-', $child->FECHA);
        }
        if (isset($child->FECHAEFECTIVA)){
            $child->FECHAEFECTIVA = str_replace('/', '-', $child->FECHAEFECTIVA);
        }
        $responses[] = $child;
    }

    if (sizeof($responses) == 0) {
        $error = sprintf("Respuesta vacía.  Método '%s'\n", $name);
        if (isset($autentication->$name)) {
            $error .= $autentication->$name->any;
        }
        else {
            $resultName = $name . 'Result';
            if (isset($autentication->$resultName)) {
                $error .= $autentication->$resultName->any;
            }
        }
        writeErrorLog($rutaArchivo, $error);
        $responses = array('success' => 'respuesta vacia');
    }

    $response = $responses;
    $data = json_encode($response, JSON_FORCE_OBJECT);
    return $data;
}

function formatData($method, $params)
{
    switch ($method) {
        case 'AbrirReparacion':
        case 'CerrarReparacion': //No responde el WS
            if (array_key_exists('fecha', $params)) {
                $params['fecha'] = strtotime($params['fecha']);
            }
            break;
    }
    return $params;
}

function createXmlModule($params, $parent, $child)
{
    $data = array();
    $id = '';
    $module = array();
    $cont = 0;
    foreach ($params as $key => $param) {
        if ($key != '_') {
            if ($id == '') {
                if (strrchr($key, '_') !== false) {
                    $id = strrchr($key, '_');
                } else {
                    $id = $key;
                }
            }
            if ($id == strrchr($key, '_') || $id == $key) {
                if (strrchr($key, '_') !== false) {
                    $module[substr($key, 0, strpos($key, '_'))] = $param;
                } else {
                    $module[$key] = $param;
                }
            } else {
                $data[] = $module;
                $module = array();
                if (strrchr($key, '_') !== false) {
                    $id = strrchr($key, '_');
                    $module[substr($key, 0, strpos($key, '_'))] = $param;
                } else {
                    $id = $key;
                    $module[$key] = $param;
                }
            }
        }
    }
    if (sizeof($module) > 0) {
        $data[] = $module;
    }
    $xml = new DomDocument('1.0', 'UTF-8');
    $root = $xml->createElement('DOCUMENTO');
    $root = $xml->appendChild($root);
    $DATA = $xml->createElement('DATA');
    $DATA = $root->appendChild($DATA);
    $MODULOS = $xml->createElement($parent);
    $MODULOS = $DATA->appendChild($MODULOS);
    foreach ($data as $key => $modules) {
        $MODULO = $xml->createElement($child);
        $MODULO = $MODULOS->appendChild($MODULO);
        foreach ($modules as $key => $module) {
            $d=$xml->createElement(strtoupper($key), $module);
            $d =$MODULO->appendChild($d);
        }

    }
    $xml->formatOutput = true;

    $strings_xml = $xml->saveXML();
    return $strings_xml;
}

function createXml($params)
{
    $xml = new DomDocument('1.0', 'UTF-8');
    $root = $xml->createElement('DOCUMENTO');
    $root = $xml->appendChild($root);
    $DATA=$xml->createElement('DATA');
    $DATA =$root->appendChild($DATA);
    foreach ($params as $key => $param) {
        $d=$xml->createElement(strtoupper($key), $param);
        $d =$DATA->appendChild($d);
    }

    $xml->formatOutput = true;

    $strings_xml = $xml->saveXML();
    return $strings_xml;
}

function cerrarModuloEquipoTicket($params, $name)
{
    $result = $name . 'Result';
    try {
        $client = new SoapClient(
            ROOT_URL_WEBSERVICE . "WSDocBase3/WSMovilidad.asmx?WSDL",
            array(
                'soap_version' => SOAP_1_2,
                "features"     => SOAP_SINGLE_ELEMENT_ARRAYS,
                "encoding"     => "utf-8",
                "trace"        => TRUE
        ));
        $autentication = $client->__soapCall(
            $name, array($name => $params)
        );
    } catch (SoapFault $fault) {
        $error = sprintf("Error en la respuesta del WS. Método '%s'\n", $name);
        if (isset($fault->faultstring)) {
            $error .= $fault->faultstring;
        }
        writeErrorLog($rutaArchivo, $error);
        $responses = array('success' => 'error');
        $data = json_encode($responses, JSON_FORCE_OBJECT);
        return $data;
    }

    $xml = simplexml_load_string($autentication->$result->any);
    $data = $xml->DATA;
    $responses = array();
    foreach ($data->children() as $child) {
        $responses[] = (array)$child;
    }

    if (sizeof($responses) == 0) {
        $responses = array('success' => 'respuesta vacia');
    }

    $response = array($responses);
    $data = json_encode($response, JSON_FORCE_OBJECT);
    return $data;
}

function writeErrorLog($rutaArchivo, $error)
{
    $errdetail = "";

    if (is_writable($rutaArchivo)) {
        $fp=fopen($rutaArchivo,"a+");
        fwrite($fp,"\n" . date('Y-m-d H:i:s ') . $error);
        fclose($fp) ;
    }
}
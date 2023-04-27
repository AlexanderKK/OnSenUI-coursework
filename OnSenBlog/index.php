<?php

    //Write data
    $data = $_POST['data'];

    if($data != null) {
        file_put_contents("data.json", $data);
    }

    //Remove image
    $id = $_POST['id'];
    if($id != null) {
        $file = 'data.json';
        $data = file_get_contents($file);
        $list = json_decode($data);

        // now, we will search the id
        for ($i = 0; $i < count($list); $i++) {

            // if we found it,
            if ($list[$i]->id === $id) {
                // we remove it
                unset($list[$i]);
                break;
            }
        }

        // make the numeric array consecutive again
        $list = array_values($list);

        // write the resulting JSON to disk
        $fs = fopen($file, 'w');
        fwrite($fs, json_encode($list));
        fclose($fs);
    }

"use strict";

var input_count = 0;
var material_pphr_hashmap = new Map();

function app_load() {
    document.getElementById("app").style.display = "block";
    initialize_input();
}

function initialize_input() {
    document.getElementById("material").value = "";
    document.getElementById("pphr").value = "";
    document.getElementById("weight").value = "";
}

function material_pphr_input() {
    var material = document.getElementById("material").value.toString();
    var pphr = document.getElementById("pphr").value;
    if (material == "" || pphr == "") return status_message("No data or insufficient data provided.");
    if (isNaN(pphr) == true) return status_message("Parts per hundred rubber must be an integer or decimal.");
    if (pphr <= 0) return status_message("Parts per hundred rubber must be greater than zero.");
    input_count += 1;
    var data_table = document.getElementById("data_table");
    var data_table_new_row = data_table.insertRow(input_count - 1);
    data_table_new_row.insertCell(0).innerText = material;
    data_table_new_row.insertCell(1).innerText = pphr;
    material_pphr_hashmap.set(material, Number(pphr));
    document.getElementById("material").value = "";
    document.getElementById("pphr").value = "";
}

function result() {
    var weight = document.getElementById("weight").value;
    if (weight == "") return status_message("No total compound weight provided.");
    if (isNaN(weight) == true) return status_message("Total compound weight must be an integer or decimal.");
    if (input_count == 0) return status_message("No materials provided.");
    if (weight <= 0) return status_message("Total compound weight must be greater than zero.");
    var pphr_sum = 0;
    for (var data of material_pphr_hashmap) {
        pphr_sum += data[1];
    };
    var csv_file_output = "Material,pphr,weight\n";
    for (var data of material_pphr_hashmap) {
        var material_weight = ((data[1] / pphr_sum) * weight).toString();
        var csv_file_output_chunk = data[0] + "," + data[1].toString() + "," + material_weight + "\n";
        csv_file_output += csv_file_output_chunk;
    };
    generate_csv_file(csv_file_output);
}

function reset() {
    initialize_input();
    document.getElementById("data_table").innerText = "";
    input_count = 0;
    material_pphr_hashmap.clear();
    status_message("Reset completed.");
}

function status_message(message_str) {
    document.getElementById("message").innerText = "Status: " + message_str;
}

function generate_csv_file(data) {
    var csv_filename = Date.now() + ".csv";
    var csv_file_download = document.createElement('a');
    csv_file_download.style.display = "none";
    csv_file_download.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    csv_file_download.setAttribute('download', csv_filename);
    document.body.appendChild(csv_file_download);
    csv_file_download.click();
    document.body.removeChild(csv_file_download);
}

window.onload = app_load;
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn_material").addEventListener("click", material_pphr_input);
    document.getElementById("btn_result").addEventListener("click", result);
    document.getElementById("btn_reset").addEventListener("click", reset);
});

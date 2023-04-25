/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    document.getElementById('version').innerHTML = 'VERSION ' + device.version + ' PLATFORM ' + device.platform;
}

function generateImg(id, latitude, longitude, accuracy, date, img) {
	return `<div class="imgTaken">
                <img style="width:250px; height: 250px;" class="album-photo" src="data:image/jpeg;base64, ${img}">
                <input type="text" id="imgID" hidden value="${id}">
                <span style="display: block;">Image taken at: ${date}</span>
                <div class="exif">Exif Data</div>
                <span style="display: block;">Latutude: ${latitude}</span>
                <span style="display: block;">Longitude: ${longitude}</span>
                <span style="display: block;">Accuracy: ${accuracy}</span>
                <span class="deleteBtn"><i class="fa fa-times" aria-hidden="true"></i></span>
            </div>`;
}

const onLoad = async() => {
	$.ajax({
		type: "GET",
		url: "http://localhost/OnSenBlog/data.json",
		cache: false,
		success: async function (data) {
            loadContent(data);
		}
	});
}
onLoad();

function loadContent(data) {
    for (const datum of data) {
        let imgItem = generateImg(datum.id, datum.latitude, datum.longitude, datum.accuracy, datum.date, datum.img);

        $('#imagesTaken').append(imgItem);
    }
}

let data = [];
let newImage = {};

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    applyDeviceData(device);
    checkConnection();
    window.addEventListener("batterystatus", onBatteryStatus, false);

    //Pick Date
    var date = $('#date');
    date.on('change', function(evt) {
        $.ajax({
            type: "GET",
            url: "http://localhost/OnSenBlog/data.json",
            cache: false,
            success: function (data) {
                $('#imagesTaken').empty();
                
                if(date.val() == "") {
                    loadContent(data);
                } else {
                    for (const datum of data) {
                        const dateValue = date.val().split("-");
                        const dateStr = `${dateValue[1].charAt(0) == '0' ? dateValue[1] = dateValue[1].slice(1) : dateValue[1]}/${dateValue[2]}/${dateValue[0]}`;
                        
                        const currentDate = datum.date.split(", ")[0];

                        if(currentDate == dateStr) {
                            let imgItem = generateImg(datum.id, datum.latitude, datum.longitude, datum.accuracy, datum.date, datum.img);
            
                            $('#imagesTaken').append(imgItem);
                        }
                    }
                }
            }
        });
    });

    $('#imagesTaken').delegate('.deleteBtn > i', 'click', function(evt) {
            
        if(evt.target && evt.target.matches('i.fa.fa-times')) {
            const id = evt.currentTarget.parentElement.parentElement.children[1].value;

            $.ajax({
                type: "POST",
                url: "http://localhost/OnSenBlog/",
                data: { id: id }
            });

            const currentImage = evt.currentTarget.parentElement.parentElement;
            fadeOutAndRemove(currentImage);
        }
    });

    $('#camera-btn').click(getPicture);
    
    function getPicture() {
        
        var onSuccess = function(position) {

            newImage = {
                id: uuidv4(),
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy.toFixed(5),
                date: position.timestamp.toLocaleString()
            }
        };

        // onError Callback receives a PositionError object

        function onError(error) {
            console.log('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        navigator.camera.getPicture(
            successCameraCallback,
            failedCamCallback, {
                quality: 25,
                destinationType: Camera.DestinationType.DATA_URL
            }
        );
    }
};

function fadeOutAndRemove(image) {
	$(image).fadeOut(350, function () {
		$(image).remove();
	});
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function onBatteryStatus(status) {
    $('#batteryStatus').val(status.level);
    if ($('#batteryStatus').val() < 30) {
        ons.notification.toast('Battery low: ' + status.level + " %. Please charge your device.", { timeout: 3000 });
    }
    $('#batteryStatusLevel').text(status.level + " %");
    if (status.isPlugged) {
        $('#isPlugged').prop("checked", true);
    } else {
        $('#isPlugged').prop("checked", false)
    }
}

function checkConnection() {
    var networkState = navigator.connection.type;
    console.log(navigator.connection);

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI] = 'WiFi';
    states[Connection.CELL_2G] = '2G';
    states[Connection.CELL_3G] = '3G';
    states[Connection.CELL_4G] = '4G';
    states[Connection.CELL] = 'Generic';
    states[Connection.NONE] = 'No network';

    $('#connectionType').text(states[networkState]);
}

function applyDeviceData(device) {
    $('#cordovaVersion').text(device.cordova);
    $('#manufacturer').text(device.manufacturer);
    $('#isVirtual').text(device.isVirtual);
    $('#deviceModel').text(device.model);
    $('#operatingSystem').text(device.platform);
    $('#uuid').text(device.uuid);
    $('#serial').text(device.serial);
    $('#osVersion').text(device.version);
}

function successCameraCallback(imageData) {
    if(imageData == null){
        ons.notification.toast('User canceled the action.',{timeout: 3000});
    }
    else{
        newImage.img = imageData;

        let imgItem = generateImg(newImage.id, newImage.latitude, newImage.longitude, newImage.accuracy, newImage.date, newImage.img);
        $('#imagesTaken').append(imgItem);
        
        ons.notification.toast('Photo successfuly taken.', { timeout: 3000 });

        let imagesData = [];

        getData(imagesData, newImage);
    }
}

function getData(imagesData, newImage) {
	$.ajax({
		type: "GET",
		url: "http://localhost/OnSenBlog/data.json",
		cache: false,
		success: function (data) {
			for (const img of data) {
				imagesData.push(img);
			}
		}
	}).done(function (result) {
		postData(imagesData, newImage);
	});

}

function postData (imagesData, newImage) {
	if(newImage != null) {
		imagesData.push(newImage);

		$.ajax({
			type: "POST",
			url: "http://localhost/OnSenBlog/",
			data: { data: JSON.stringify(imagesData) }
		});
	}
}

function failedCamCallback(message) {
    alert(message);
}
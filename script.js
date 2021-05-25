$("ul.number_list > li").click(function () {
    let rowId = $(this).attr('data-id')
    if (!$(this).hasClass('active_point')) {
        $(`ul.number_list-${rowId}`).each(function (a) {
            $(`ul.number_list-${rowId} > li`).removeClass('active_point')
        })
        $(this).addClass('active_point')
    } else {
        $(this).removeClass('active_point')
    }
})

const config = {
    target: undefined,
    line: $(".line"),
    delay: 40 // enter zero for live resizing
}
const drawBetweenObjects = {
    //cmake the line
    makeLine: function (line, startPoint, endPoint) {
        //debugger
        var className = startPoint.attr('id') + endPoint.attr('id');
        if (className.includes("undefined") !== true) { //error check
            $(line).clone().addClass('deleteMe').addClass(className).removeClass("original").insertAfter(line);
            //calculations (for legibility, these are separte vars)
            var x1 = startPoint.offset().left + (startPoint.width() / 2);
            var y1 = startPoint.offset().top + (startPoint.height() / 2);
            var x2 = endPoint.offset().left + (endPoint.width() / 2);
            var y2 = endPoint.offset().top + (endPoint.height() / 2);
            $("." + className).attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2); //svg attributes
        } else { console.error("undefined object") }
    },
    findLines: function (search) {
        $(".deleteMe").remove(); //remove last set of lines
        let count = 1, first, last;
        $(search).each(function (index, el) {
            if (search.eq(index + 1).length) { //only do drawBetweenObject if there is another.
                (count === 1 ? first = $(this) : ''), count++;
                last = search.eq(index + 1);
                drawBetweenObjects.makeLine(config.line, $(this), search.eq(index + 1));   //args order - line, div1 and div2 - the next div.
            }
        });
        drawBetweenObjects.makeLine(config.line, first, last);
    }
}

$("button#connect").click(function () {
    config.target = $(".active_point");
    console.log(config.target)
    drawBetweenObjects.findLines(config.target);
    $(this).hide()
    $('#printPDF').show()
})
$("button#printPDF").click(function () {
    $('div#mailModal').fadeIn('fast')
    //printFn();
    //test();
    //test2()
})
// async function test2() {
//     let mCanvas;
//     let div = document.getElementById('container');
//     $('#output').empty();
//     await html2canvas(div).then(
//         function (canvas) {
//             document.getElementById('output').appendChild(canvas);
//             mCanvas = canvas;
//         }).then(function () {

//             var img = mCanvas.toDataURL("image/png");
//             var doc = new jsPDF('l', 'mm', [297, 210]);
//             doc.addImage(img, 'JPEG', 0, 0);
//             // Making Data URI
//             var out = doc.output();
//             var url = 'data:application/pdf;base64,' + btoa(out);

//             Email.send({
//                 Host: "smtp.gmail.com",
//                 Username: "owaisafsar.mail@gmail.com",
//                 Password: "nxpphjtlwnxfofzk",
//                 To: "owaisafsar.mail@gmail.com",
//                 From: "owaisafsar.mail@gmail.com",
//                 Subject: `New Mail from "test"`,
//                 Body: "owaisafsar.mail@gmail.com",
//                 Attachments: [
//                     {
//                         name: "wheel-of-life-cycle.pdf",
//                         data: url
//                     }
//                 ]
//             })
//                 .then((message) => {
//                     console.log(message)
//                 });
//         });
// }

// var pdfBase64 = undefined;
// function test() {
//     let $pdf = document.getElementById("html")
//     console.log($pdf)
//     var opt = {
//         margin: 0,
//         filename: 'wheel-of-life-cycle.pdf',
//         image: { type: 'jpeg', quality: 1 },
//         html2canvas: { scale: 1 },
//         jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
//     };

//     // New Promise-based usage:
//     // html2pdf().from($pdf).set(opt).save();
//     pdfBase64 = html2pdf().from($pdf).set(opt);
//     console.log(pdfBase64)
// }

// async function printFn() {
//     let div = document.getElementById('container');
//     $('#output').empty();
//     await html2canvas(div).then(
//         function (canvas) {
//             document
//                 .getElementById('output')
//                 .appendChild(canvas);
//         });
//     await printJS({
//         printable: 'output',
//         type: 'html',
//         header: ''
//     })
// }

$(document).keypress("u", function (e) {
    if (e.ctrlKey) {
        return false;
    }
    else {
        return true;
    }
});
// Right Click
document.addEventListener('contextmenu', event => event.preventDefault());
// F12
document.onkeypress = function (event) {
    event = (event || window.event);
    if (event.keyCode == 123) {
        return false;
    }
}
document.onmousedown = function (event) {
    event = (event || window.event);
    if (event.keyCode == 123) {
        return false;
    }
}
document.onkeydown = function (event) {
    event = (event || window.event);
    if (event.keyCode == 123) {
        return false;
    }
    if (event.ctrlKey &&
        (event.keyCode === 67 ||
            event.keyCode === 86 ||
            event.keyCode === 85 ||
            event.keyCode === 117)) {
        return false;
    } else {
        return true;
    }
}

// Listen for a submit
document.querySelector(".contact-form").addEventListener("submit", submitForm);
function submitForm(e) {
    e.preventDefault();
    let button = document.querySelector(".contact-submit");
    button.setAttribute("disabled", "disabled");
    $('.email_btn_loader').show()
    //   Get input Values
    let name = document.querySelector(".contact-name").value;
    let email = document.querySelector(".contact-email").value;
    if (name == "" || email == "") {
        $(".modal-content").notify(
            "Please fill details correctly.", "error",
            { position: "bottom" }
        );
        button.removeAttribute("disabled");
        $('.email_btn_loader').hide()
        return
    }
    if (ValidateEmail(email) == "false") {
        $(".modal-content").notify(
            "Enter correct email address.", "error",
            { position: "bottom" }
        );
        button.removeAttribute("disabled");
        $('.email_btn_loader').hide()
        return
    }
    sendEmail(name, email, button)
}
const ValidateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(String(email).toLowerCase())) {
        return "true";
    }
    else {
        return "false";
    }
}
function sendEmail(name, email, button) {

    let mCanvas;
    let div = document.getElementById('container');
    $('#output').empty();
    html2canvas(div).then(
        function (canvas) {
            document.getElementById('output').appendChild(canvas);
            mCanvas = canvas;
        }).then(function () {

            var img = mCanvas.toDataURL("image/png");
            var doc = new jsPDF('l', 'mm', [297, 210]);
            doc.addImage(img, 'JPEG', 0, 0);
            // Making Data URI
            var out = doc.output();
            var url = 'data:application/pdf;base64,' + btoa(out);

            Email.send({
                Host: "smtp.gmail.com",
                Username: "owaisafsar.mail@gmail.com",
                Password: "nxpphjtlwnxfofzk",
                // To: email,
                // From: "owaisafsar.mail@gmail.com",
                To: email,
                From: "owaisafsar.mail@gmail.com",
                Subject: `New Mail from '${name}'`,
                Body: `Sender Name: <b>${name}</b> <br> Sender Email: <b>${email}</b>`,
                Attachments: [
                    {
                        name: "wheel-of-life-cycle.pdf",
                        data: url
                    }
                ]
            })
                .then((message) => {
                    console.log(message)
                    if (message === "OK") {
                        document.querySelector(".contact-form").reset();
                        // success message
                        $(".modal-content").notify(
                            "Message has been send successfully! I will get back to you ASAP!", "success",
                            { position: "bottom" }
                        );
                        $('div#mailModal').fadeOut('fast')
                    } else {
                        // error message
                        $(".modal-content").notify(
                            "Something went wrong! Kindly pick another way to connect with me.", "error",
                            { position: "bottom" }
                        );
                    }
                    button.removeAttribute("disabled");
                    $('.email_btn_loader').hide()
                });
        });
}
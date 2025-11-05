const diaryForm = document.getElementById("diaryForm");
const responseCard = document.getElementById("responseCard");
const responseImage = document.getElementById("responseImage");
const createAnotherIcon = document.getElementById("createAnotherIcon");
const closeIcon = document.getElementById("closeIcon");
const downloadBtn = document.getElementById("downloadBtn");

let lastTeacher = "nafis Sir";

diaryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    responseCard.style.display = "none";

    const teacherName = document.getElementById("teacher").value || "nafis Sir";
    lastTeacher = teacherName; 

    const params = {
        cls: document.getElementById("class").value,
        subject: document.getElementById("subject").value,
        cw: document.getElementById("classwork").value,
        hw: document.getElementById("homework").value,
        remark: document.getElementById("remarks").value,
        teacher: teacherName,
        date: null,
    };

    generateImage(params);
});

closeIcon.addEventListener("click", function () {
    responseCard.style.display = "none";
});

downloadBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = responseImage.src;
    link.download = "diary_entry.png";
    link.click();
});

createAnotherIcon.addEventListener("click", function() {
    responseCard.style.display = "none";

    document.getElementById("classwork").value = "";
    document.getElementById("homework").value = "";
    document.getElementById("remarks").value = "N/A";
    
    document.getElementById("teacher").value = lastTeacher;
});

async function generateImage(params) {
    const { cls, subject, cw, hw, remark, teacher, date } = params;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const bg = new Image();
    bg.crossOrigin = "anonymous"; 

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const lines = text.split("\n");
        lines.forEach((line) => {
            const words = line.split(" ");
            let currentLine = "";
            for (let n = 0; n < words.length; n++) {
                const testLine = currentLine + words[n] + " ";
                const metrics = context.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    context.fillText(currentLine, x, y);
                    currentLine = words[n] + " ";
                    y += lineHeight;
                } else {
                    currentLine = testLine;
                }
            }
            context.fillText(currentLine, x, y);
            y += lineHeight;
        });
    }

    let dateText;
    if (date) {
        dateText = `Date: ${date}`;
    } else {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = currentDate.getFullYear();
        const dayName = currentDate.toLocaleString("en-US", {
            weekday: "long",
        });
        dateText = `Date: ${day}.${month}.${year} (${dayName})`;
    }

    if (hw && hw.trim() !== "") {
        bg.src = "bg-v2.jpg";
        await new Promise((resolve) => (bg.onload = resolve));

        canvas.width = bg.width;
        canvas.height = bg.height;
        ctx.drawImage(bg, 0, 0);

        ctx.font = "63px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";

        ctx.fillText(cls, 375, 762);
        ctx.fillText(subject, 425, 892);
        ctx.fillText(teacher || "Nabila Tabassum", 695, 1018);
        wrapText(ctx, cw, 181, 1240, 2000, 70);
        wrapText(ctx, hw, 181, 1668, 2000, 70);
        wrapText(ctx, remark, 181, 2100, 2000, 70);

        ctx.textAlign = "center";
        ctx.fillText(dateText, bg.width - 800, 763);

    } else {
        bg.src = "bg.jpg";
        await new Promise((resolve) => (bg.onload = resolve));

        canvas.width = bg.width;
        canvas.height = bg.height;
        ctx.drawImage(bg, 0, 0);

        ctx.font = "63px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";

        ctx.fillText(cls, 372, 772);
        ctx.fillText(subject, 422, 902);
        ctx.fillText(teacher || "Nabila Tabassum", 692, 1029);
        wrapText(ctx, cw, 179, 1227, 2000, 70);

        ctx.textAlign = "center";
        ctx.fillText(dateText, bg.width - 838, 775);
    }

    responseImage.src = canvas.toDataURL("image/png");
    responseCard.style.display = "block";
}

function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent = "❄";
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
    snowflake.style.opacity = Math.random();

    document.body.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), 10000);
}

setInterval(createSnowflake, 300);

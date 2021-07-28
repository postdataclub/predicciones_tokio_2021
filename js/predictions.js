$.getJSON("data/domains.json", function (domains) {
    $.getJSON("data/predictions.json", function (data) {

        function render(pdata) {
            let sports = new Set();
            let sdict = {};
            for (var i in data.events) {
                let ev = data.events[i];
                if (("male" in ev.sex) && (ev.sex.male.predicted)) {
                    sports.add(ev.sport);
                    if (!(ev.sport in sdict)) {
                        sdict[ev.sport] = { "male": [{ "id": i, "event": ev.name, "pred": ev.sex.male }] };
                    } else {
                        if (!("male" in sdict[ev.sport])) {
                            sdict[ev.sport]["male"] = [{ "id": i, "event": ev.name, "pred": ev.sex.male }];
                        } else {
                            sdict[ev.sport]["male"].push({ "id": i, "event": ev.name, "pred": ev.sex.male });
                        }
                    }

                }
                if (("female" in ev.sex) && (ev.sex.female.predicted)) {
                    sports.add(ev.sport);
                    if (!(ev.sport in sdict)) {
                        sdict[ev.sport] = { "female": [{ "id": i, "event": ev.name, "pred": ev.sex.female }] };
                    } else {
                        if (!("female" in sdict[ev.sport])) {
                            sdict[ev.sport]["female"] = [{ "id": i, "event": ev.name, "pred": ev.sex.female }];
                        } else {
                            sdict[ev.sport]["female"].push({ "id": i, "event": ev.name, "pred": ev.sex.female });
                        }
                    }
                }
                if (("mixed" in ev.sex) && (ev.sex.mixed.predicted)) {
                    sports.add(ev.sport);
                    if (!(ev.sport in sdict)) {
                        sdict[ev.sport] = { "mixed": [{ "id": i, "event": ev.name, "pred": ev.sex.mixed }] };
                    } else {
                        if (!("mixed" in sdict[ev.sport])) {
                            sdict[ev.sport]["mixed"] = [{ "id": i, "event": ev.name, "pred": ev.sex.mixed }];
                        } else {
                            sdict[ev.sport]["mixed"].push({ "id": i, "event": ev.name, "pred": ev.sex.mixed });
                        }
                    }
                }
            }
            sports = Array.from(sports);
            sports.sort();
            console.log(sdict)
            let text = "";
            for (var s in sports) {
                text += "<div id='" + sports[s] + "' class='sport-title'> <p><img class='sport-icon' src='images/" + sports[s] + ".png'> <span>" + data.sports[sports[s]].name + "</span> <span id='" + sports[s] + "-more' class='sport-more'>+</span> <span id='" + sports[s] + "-less' class='sport-less' style='display:none'>-</span></p></div><hr>";
                text += "<div id='" + sports[s] + "-sport' class='sport-block'  style='display:none'>";
                if ("female" in sdict[sports[s]]) {
                    text += "<div id='" + sports[s] + "-female' class='sex-title'>Mujeres</div>";
                    for (var e in sdict[sports[s]].female) {
                        text += renderPrediction(sports[s], sdict[sports[s]].female[e].id, sdict[sports[s]].female[e].event, "fem", sdict[sports[s]].female[e].pred);
                    }
                }
                if ("male" in sdict[sports[s]]) {
                    text += "<div id='" + sports[s] + "-male' class='sex-title'>Hombres</div>";
                    for (var e in sdict[sports[s]].male) {
                        text += renderPrediction(sports[s], sdict[sports[s]].male[e].id, sdict[sports[s]].male[e].event, "mas", sdict[sports[s]].male[e].pred);
                    }
                }
                if ("mixed" in sdict[sports[s]]) {
                    text += "<div id='" + sports[s] + "-mixed' class='sex-title'>Mixto</div>";
                    for (var e in sdict[sports[s]].mixed) {
                        text += renderPrediction(sports[s], sdict[sports[s]].mixed[e].id, sdict[sports[s]].mixed[e].event, "mix", sdict[sports[s]].mixed[e].pred);
                    }
                }
                text += "</div>";
            }
            $('#info').html(text);
        }
        function renderPrediction(sp, id, name, sex, pred) {
            let text = "<div id='" + sp + "-" + id + "-" + sex + "' class='event-title'>" + name + " <span id='" + sp + "-" + id + "-" + sex + "-more' class='event-more'>+</span><span id='" + sp + "-" + id + "-" + sex + "-less' class='event-less'  style='display:none;'>-</span></div>";
            text += "<div id='" + sp + "-" + id + "-" + sex + "-block' class='event-block' style='display:none;'>";
            text += "<div class='pred'>Pronóstico</div>";
            text += "<div class='pred-block'>";
            text += renderPredictionItem("gold", pred.prediction.oro);
            text += renderPredictionItem("silver", pred.prediction.plata);
            if (Array.isArray(pred.prediction.bronce)) {
                for (var b in pred.prediction.bronce) {
                    text += renderPredictionItem("bronce", pred.prediction.bronce[b]);
                }
            } else {
                text += renderPredictionItem("bronce", pred.prediction.bronce);
            }
            text += "</div>";
            if (pred.updated) {
                text += "<div class='podium'>Medallistas</div>";
                text += "<div class='podium-block'>";
                text += renderPredictionItemSingle("gold", "normal", pred.positions.oro);
                text += renderPredictionItemSingle("silver", "normal", pred.positions.plata);
                if (Array.isArray(pred.prediction.bronce)) {
                    for (var b in pred.prediction.bronce) {
                        text += renderPredictionItemSingle("bronce", "normal", pred.positions.bronce[b]);
                    }
                } else {
                    text += renderPredictionItemSingle("bronce", "normal", pred.positions.bronce);
                }
                text += "</div>";
            }
            text += "</div>";
            return text;
        }

        function renderPredictionItem(medal, item) {
            let cssclass = "normal";
            if (item.status === 1) { cssclass = "good" }
            if (item.status === 2) { cssclass = "excellent" }
            if (item.status === -1) { cssclass = "wrong" }
            return renderPredictionItemSingle(medal, cssclass, item);
        }

        function renderPredictionItemSingle(medal, cssclass, item) {
            let text = "<div class='pred-item'>";
            text += "<p class='" + cssclass + "'>";
            if (medal === "gold") {
                text += "<img class='medal' src='images/gold.png'>"
            } else {
                if (medal === "silver") {
                    text += "<img class='medal' src='images/silver.png'>"
                } else {
                    text += "<img class='medal' src='images/bronze.png'>"
                }
            }
            text += "<img class='flag' src='images/flags-mini/" + domains[item.country.toLowerCase()] + ".png'> <span class='country'>" + item.country + "</span>";
            if ("name" in item) {
                text += "<span class='athlete'>" + item.name + "</span>";
            } else {
                text += "<span class='athlete'>" + item.country + "</span>";
            }
            text += "</p>";
            text += "</div>";
            return text;
        }
        render(data);

        $('.sport-less').click(function (e) {
            let id = e.target.id;
            let nid = id.replace("less", "sport");
            let mid = id.replace("less", "more");
            $("#" + id).hide();
            $("#" + mid).show();
            $("#" + nid).slideUp();
        });

        $('.sport-more').click(function (e) {
            let id = e.target.id;
            let nid = id.replace("more", "sport");
            let lid = id.replace("more", "less");
            $("#" + id).hide();
            $("#" + lid).show();
            $("#" + nid).slideDown();
        });

        $('.event-less').click(function (e) {
            let id = e.target.id;
            let nid = id.replace("less", "block");
            let mid = id.replace("less", "more");
            $("#" + id).hide();
            $("#" + mid).show();
            $("#" + nid).slideUp();
        });

        $('.event-more').click(function (e) {
            let id = e.target.id;
            let nid = id.replace("more", "block");
            let lid = id.replace("more", "less");
            $("#" + id).hide();
            $("#" + lid).show();
            $("#" + nid).slideDown();
        });

    });
});

$.ajaxSetup({ cache: false});
$.getJSON("data/domains.json", function (domains) {
    $.getJSON("data/predictions.json", function (data) {

        function getStats(sports) {
            let ev = data.events;
            let stats = {
                "all": { "total": 0, "events": 0, "updated_events": 0, "medals": 0, "pred_medals": 0, "exact_medals": 0, "champions": 0 }
            }
            for (var i in sports) {
                stats[sports[i]] = { "total": 0, "events": 0, "updated_events": 0, "medals": 0, "pred_medals": 0, "exact_medals": 0, "champions": 0 }
            }
            for (var e in ev) {
                if ("female" in ev[e].sex) {
                    setEventStat(ev[e].sport, stats, ev[e].sex.female)
                }
                if ("male" in ev[e].sex) {
                    setEventStat(ev[e].sport, stats, ev[e].sex.male)
                }
                if ("mixed" in ev[e].sex) {
                    setEventStat(ev[e].sport, stats, ev[e].sex.mixed)
                }

            }
            return stats;

        }
        function setEventStat(sport, stats, even) {
            stats.all.total += 1;
            if (sport in stats) {
                stats[sport].total += 1;
            }
            if (even.predicted) {
                stats.all.events += 1;
                if (sport in stats) {
                    stats[sport].events += 1;
                }
            }
            if (even.updated) {
                stats.all.updated_events += 1;
                stats.all.medals += 3;
                switch (even.prediction.oro.status) {
                    case 2:
                        stats.all.pred_medals += 1;
                        stats.all.exact_medals += 1;
                        stats.all.champions += 1;
                        break;
                    case 1:
                        stats.all.pred_medals += 1;
                        break
                }
                switch (even.prediction.plata.status) {
                    case 2:
                        stats.all.pred_medals += 1;
                        stats.all.exact_medals += 1;
                        break;
                    case 1:
                        stats.all.pred_medals += 1;
                        break
                }
                if (Array.isArray(even.prediction.bronce)) {
                    stats.all.medals += 1;
                    switch (even.prediction.bronce[0].status) {
                        case 2:
                            stats.all.pred_medals += 1;
                            stats.all.exact_medals += 1;
                            break;
                        case 1:
                            stats.all.pred_medals += 1;
                            break
                    }
                    switch (even.prediction.bronce[1].status) {
                        case 2:
                            stats.all.pred_medals += 1;
                            stats.all.exact_medals += 1;
                            break;
                        case 1:
                            stats.all.pred_medals += 1;
                            break
                    }
                } else {
                    switch (even.prediction.bronce.status) {
                        case 2:
                            stats.all.pred_medals += 1;
                            stats.all.exact_medals += 1;
                            break;
                        case 1:
                            stats.all.pred_medals += 1;
                            break
                    }
                }
                if (sport in stats) {
                    stats[sport].updated_events += 1;
                    stats[sport].medals += 3;
                    switch (even.prediction.oro.status) {
                        case 2:
                            stats[sport].pred_medals += 1;
                            stats[sport].exact_medals += 1;
                            stats[sport].champions += 1;
                            break;
                        case 1:
                            stats[sport].pred_medals += 1;
                            break
                    }
                    switch (even.prediction.plata.status) {
                        case 2:
                            stats[sport].pred_medals += 1;
                            stats[sport].exact_medals += 1;
                            break;
                        case 1:
                            stats[sport].pred_medals += 1;
                            break
                    }
                    if (Array.isArray(even.prediction.bronce)) {
                        stats[sport].medals += 1;
                        switch (even.prediction.bronce[0].status) {
                            case 2:
                                stats[sport].pred_medals += 1;
                                stats[sport].exact_medals += 1;
                                break;
                            case 1:
                                stats[sport].pred_medals += 1;
                                break
                        }
                        switch (even.prediction.bronce[1].status) {
                            case 2:
                                stats[sport].pred_medals += 1;
                                stats[sport].exact_medals += 1;
                                break;
                            case 1:
                                stats[sport].pred_medals += 1;
                                break
                        }
                    } else {
                        switch (even.prediction.bronce.status) {
                            case 2:
                                stats[sport].pred_medals += 1;
                                stats.all.exact_medals += 1;
                                break;
                            case 1:
                                stats[sport].pred_medals += 1;
                                break
                        }
                    }
                }
            }
        }

        function renderStats(stats) {
            let event1 = "eventos pronosticados";
            if (stats.events == 1) { event1 = "evento pronosticado"; }
            let pos1 = "posibles"
            if (stats.total == 1) { pos1 = "posible" }
            let text = "<div id='stats-total' class='stats-item''>" + stats.events + " " + event1 + " de " + stats.total + " " + pos1 + "</div>";
            if (stats.updated_events == 1) {
                text += "<div id='stats-pred' class='stats-item''>" + stats.updated_events + " evento pronosticado ha concluido</div>";
            } else {
                text += "<div id='stats-pred' class='stats-item''>" + stats.updated_events + " eventos pronosticados han concluido</div>";
            }
            text += "<div id='stats-medals' class='stats-item''>" + stats.medals + " medallas repartidas en estos eventos</div>";
            if (stats.pred_medals == 1) {
                text += "<div id='stats-medalists' class='stats-item''>" + stats.pred_medals + " medallista acertado de " + stats.medals + " posibles</div>";
            } else {
                text += "<div id='stats-medalists' class='stats-item''>" + stats.pred_medals + " medallistas acertados de " + stats.medals + " posibles</div>";
            }
            if (stats.exact_medals == 1) {
                text += "<div id='stats-medalists' class='stats-item''>" + stats.exact_medals + " posición exacta de " + stats.medals + " posibles</div>";
            } else {
                text += "<div id='stats-medalists' class='stats-item''>" + stats.exact_medals + " posiciones exactas de " + stats.medals + " posibles</div>";
            }
            let champ = "campeones pronosticados";
            if (stats.champions == 1) { champ = "campeón pronosticado" }
            let pos2 = "posibles";
            if (stats.updated_events == 1) { pos2 = "posible" }
            text += "<div id='stats-medalists' class='stats-item''>" + stats.champions + " " + champ + " de " + stats.updated_events + " " + pos2 + "</div>";
            return text;
        }

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
            stats = getStats(sports);
            $('#stats').html(renderStats(stats.all));
            let text = "";
            for (var s in sports) {
                text += "<div id='" + sports[s] + "' class='sport-title'> <p><img class='sport-icon' src='images/" + sports[s] + ".png'> <span>" + data.sports[sports[s]].name + "</span> <span id='" + sports[s] + "-more' class='sport-more'>+</span> <span id='" + sports[s] + "-less' class='sport-less' style='display:none'>-</span></p></div><hr>";
                text += "<div id='" + sports[s] + "-sport' class='sport-block'  style='display:none'>";
                text += "<div id='" + sports[s] + "-stats-sport' class='stats-sport'>" + renderStats(stats[sports[s]]) + "</div>";
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
            let finished = "no";
            if (pred.updated) {
                finished = "si";
            }
            let text = "<div id='" + sp + "-" + id + "-" + sex + "' class='event-title'><span id='" + finished + "'>&nbsp;&nbsp;&nbsp;</span>" + name + " <span id='" + sp + "-" + id + "-" + sex + "-more' class='event-more'>+</span><span id='" + sp + "-" + id + "-" + sex + "-less' class='event-less'  style='display:none;'>-</span></div>";
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
                if (Array.isArray(pred.positions.oro)) {
                    for (var b in pred.positions.oro) {
                        text += renderPredictionItemSingle("gold", "normal", pred.positions.oro[b]);
                    }
                } else {
                    text += renderPredictionItemSingle("gold", "normal", pred.positions.oro);
                }
                //text += renderPredictionItemSingle("gold", "normal", pred.positions.oro);
                if ("plata" in pred.positions) {
                    if (Array.isArray(pred.positions.plata)) {
                        for (var b in pred.positions.plata) {
                            text += renderPredictionItemSingle("silver", "normal", pred.positions.plata[b]);
                        }
                    } else {
                        text += renderPredictionItemSingle("silver", "normal", pred.positions.plata);
                    }
                    //text += renderPredictionItemSingle("silver", "normal", pred.positions.plata);
                }
                if ("bronce" in pred.positions) {
                    if (Array.isArray(pred.prediction.bronce)) {
                        for (var b in pred.prediction.bronce) {
                            text += renderPredictionItemSingle("bronce", "normal", pred.positions.bronce[b]);
                        }
                    } else {
                        text += renderPredictionItemSingle("bronce", "normal", pred.positions.bronce);
                    }
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

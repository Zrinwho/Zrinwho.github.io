// All project content lives here (en / de / zh). project.html?id=<id> renders one entry;
// index.html renders the list. To add a project, append an object to PROJECTS.
(function () {
  // ---------- helpers ----------
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function t(o, tag) {
    tag = tag || 'span';
    if (typeof o === 'string') return esc(o);
    return ['en', 'de', 'zh'].map(function (l) {
      return '<' + tag + ' data-l="' + l + '">' + o[l] + '</' + tag + '>';
    }).join('');
  }
  // translated SVG text
  function st(x, y, o, cls, anchor) {
    var a = anchor ? ' text-anchor="' + anchor + '"' : '';
    return ['en', 'de', 'zh'].map(function (l) {
      return '<text data-l="' + l + '" x="' + x + '" y="' + y + '" class="' + (cls || 'tx') + '"' + a + '>' + o[l] + '</text>';
    }).join('');
  }
  function svg(h, body) {
    return '<svg viewBox="0 0 800 ' + h + '" role="img" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  }
  // horizontal process flow of boxes
  function flow(steps, hl) {
    var n = steps.length, w = 800, gap = 18, bw = (w - gap * (n - 1)) / n, out = '';
    steps.forEach(function (s, i) {
      var x = i * (bw + gap), on = hl && hl.indexOf(i) > -1;
      out += '<rect x="' + (x + .5) + '" y="40.5" width="' + (bw - 1) + '" height="100" class="' + (on ? 'boxa' : 'box') + '"/>';
      out += '<text x="' + (x + 10) + '" y="62" class="' + (on ? 'txw' : 'num') + '">' + String(i + 1).padStart(2, '0') + '</text>';
      ['en', 'de', 'zh'].forEach(function (l) {
        var words = s[l].split('|');
        words.forEach(function (wd, k) {
          out += '<text data-l="' + l + '" x="' + (x + 10) + '" y="' + (98 + k * 17) + '" class="' + (on ? 'txw' : 'tk') + '">' + wd + '</text>';
        });
      });
      if (i < n - 1) out += '<path d="M' + (x + bw + 3) + ' 90 h' + (gap - 6) + '" class="ln" marker-end="url(#ar)"/>';
    });
    return svg(170, '<defs><marker id="ar" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L6 3L0 6z" class="tkf"/></marker></defs>' + out);
  }
  function L(en, de, zh) { return { en: en, de: de, zh: zh }; }

  var LBL = {
    context: L('Context', 'Ausgangslage', '背景'),
    approach: L('Approach', 'Vorgehen', '方法'),
    result: L('Result', 'Ergebnis', '结果'),
    figure: L('Figure', 'Abbildung', '图示'),
    period: L('Period', 'Zeitraum', '时间'),
    role: L('Role', 'Rolle', '角色'),
    org: L('Organisation', 'Organisation', '单位'),
    methods: L('Methods', 'Methoden', '方法 / 工具'),
    lead: L('Project Lead', 'Projektleitung', '项目负责人'),
    illus: L('Schematic, illustrative values — not production data.', 'Schematische Darstellung mit illustrativen Werten — keine Produktionsdaten.', '示意图，数值仅为说明，非生产数据。'),
    back: L('← All projects', '← Alle Projekte', '← 全部项目'),
    prev: L('Previous', 'Vorheriges', '上一个'),
    next: L('Next', 'Nächstes', '下一个')
  };

  var GROUPS = [
    { id: 'duracell', name: L('Industry — Duracell', 'Industrie — Duracell', '工业 — 金霸王 Duracell') },
    { id: 'axxon', name: L('Industry — AXXON', 'Industrie — AXXON', '工业 — 轴心自控 AXXON') },
    { id: 'academic', name: L('Academic', 'Forschung', '学术') }
  ];

  // ---------- figures ----------
  function figHeatSeal() {
    var b = '';
    b += '<path d="M150 30 V320 H780" class="ln"/>';
    b += st(154, 22, L('Seal strength', 'Siegelfestigkeit', '热封强度'), 'tx');
    b += st(780, 344, L('Aging / shelf time →', 'Alterung / Lagerzeit →', '老化 / 货架时间 →'), 'tx', 'end');
    b += '<path d="M150 236 H780" class="lm dash"/>' + st(776, 230, L('Critical failure threshold', 'Kritische Versagensschwelle', '临界失效阈值'), 'tx', 'end');
    b += '<path d="M150 150 H780" class="a"/>' + st(776, 144, L('Acceptance limit at release', 'Annahmegrenze bei Freigabe', '出厂验收限'), 'txa', 'end');
    b += '<path d="M130 150 V236" class="a"/><path d="M126 150 h8 M126 236 h8" class="a"/>';
    b += st(120, 198, L('aging margin', 'Alterungsreserve', '老化裕量'), 'txa', 'end');
    b += '<path d="M170 70 C 330 92, 530 132, 760 168" class="ink2"/>';
    b += '<circle cx="170" cy="70" r="5" class="tkf"/>' + st(182, 64, L('Pass — stays above threshold', 'Bestanden — bleibt über der Schwelle', '合格 — 始终高于阈值'), 'tk');
    b += '<path d="M170 176 C 330 200, 530 240, 760 276" class="mute2"/>';
    b += '<circle cx="170" cy="176" r="5" class="af"/>' + st(760, 302, L('Held at release — would fail on the shelf', 'Bei Freigabe gesperrt — würde im Regal versagen', '出厂即拦截 — 否则将在货架期失效'), 'txa', 'end');
    return svg(356, b);
  }

  function figAnode() {
    var b = '', segs = [[60, L('Dosing volume', 'Dosiervolumen', '体积'), 'af'], [25, L('Density', 'Dichte', '密度'), 'af2'], [15, L('Noise', 'Rauschen', '噪声'), 'rf']];
    var x = 0;
    b += st(0, 18, L('Variance decomposition of anode weight', 'Varianzzerlegung des Anodengewichts', '阳极重量方差分解'), 'tk');
    segs.forEach(function (s) {
      var w = s[0] * 8;
      b += '<rect x="' + x + '" y="32" width="' + (w - 2) + '" height="44" class="' + s[2] + '"/>';
      b += '<text x="' + (x + 10) + '" y="60" class="' + (s[2] === 'rf' ? 'tk' : 'txw') + ' big">' + s[0] + '%</text>';
      b += st(x, 98, s[1], 'tx');
      x += w;
    });
    // raw cyclic signal vs de-cyclized residual
    var raw = '', res = '';
    for (var i = 0; i <= 160; i++) {
      var px = i * 5, ph = (i % 32) / 32;
      var y1 = 190 + (ph * 52 - 26) + Math.sin(i * 1.7) * 5;
      var y2 = 290 + Math.sin(i * 1.7) * 5 + Math.cos(i * .9) * 3;
      raw += (i ? 'L' : 'M') + px + ' ' + y1.toFixed(1);
      res += (i ? 'L' : 'M') + px + ' ' + y2.toFixed(1);
    }
    b += st(0, 140, L('Raw signal: tank-level cycles trigger false SPC alarms', 'Rohsignal: Tankzyklen lösen SPC-Fehlalarme aus', '原始信号：料罐液位周期触发 SPC 误报'), 'tx');
    b += '<path d="M0 172 H800 M0 208 H800" class="lm dash"/><path d="' + raw + '" class="mute1"/>';
    b += st(0, 254, L('After de-cyclizing with the predictive model: ~90% fewer false alarms', 'Nach Entzyklisierung per Vorhersagemodell: ~90 % weniger Fehlalarme', '预测模型去周期化后：误报减少约 90%'), 'txa');
    b += '<path d="M0 272 H800 M0 308 H800" class="lm dash"/><path d="' + res + '" class="a"/>';
    return svg(320, b);
  }

  function figRca() {
    var b = '', base = 260, k = 2.2;
    b += '<path d="M40 ' + base + ' H780" class="ln"/>';
    b += st(40, 20, L('False-reject scrap per shift (index, before = 100)', 'Fehlausschuss pro Schicht (Index, vorher = 100)', '每班误判报废（指数，改善前 = 100）'), 'tk');
    b += '<rect x="120" y="' + (base - 100 * k) + '" width="160" height="' + (100 * k) + '" class="rf"/>';
    b += '<text x="128" y="' + (base - 100 * k + 26) + '" class="tk big">100</text>';
    b += '<rect x="460" y="' + (base - 9 * k) + '" width="160" height="' + (9 * k) + '" class="af"/>';
    b += '<text x="468" y="' + (base - 9 * k - 10) + '" class="txa big">≈ 9</text>';
    b += '<path d="M60 ' + (base - 33 * k) + ' H760" class="a dash"/>' + st(760, base - 33 * k - 8, L('Target', 'Ziel', '目标'), 'txa', 'end');
    b += st(120, base + 24, L('Before', 'Vorher', '改善前'), 'tx');
    b += st(460, base + 24, L('After — sustained', 'Nachher — nachhaltig', '改善后 — 持续稳定'), 'tx');
    return svg(300, b);
  }

  function figSupport() {
    var sites = [
      L('Huawei Precision', 'Huawei Precision', '华为精密'), L('Huawei Terminal', 'Huawei Terminal', '华为终端'), L('Honor', 'Honor', '荣耀'),
      L('Foxconn Taiyuan', 'Foxconn Taiyuan', '太原富士康'), L('PCBA Qinhuangdao', 'PCBA Qinhuangdao', 'PCBA 秦皇岛'),
      L('PCBA Shenzhen', 'PCBA Shenzhen', 'PCBA 深圳'), L('PCBA Huai\'an', 'PCBA Huai\'an', 'PCBA 淮安'), L('PCBA India', 'PCBA Indien', 'PCBA 印度')
    ];
    var cx = 400, cy = 170, b = '';
    sites.forEach(function (s, i) {
      var a = -Math.PI / 2 + i * Math.PI * 2 / sites.length, x = cx + Math.cos(a) * 270, y = cy + Math.sin(a) * 130;
      b += '<path d="M' + cx + ' ' + cy + ' L' + x.toFixed(1) + ' ' + y.toFixed(1) + '" class="lm"/>';
      b += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" class="tkf"/>';
      var anc = Math.abs(Math.cos(a)) < .2 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end');
      var dx = anc === 'start' ? 12 : anc === 'end' ? -12 : 0, dy = Math.sin(a) < -.9 ? -12 : Math.sin(a) > .9 ? 22 : 4;
      b += st((x + dx).toFixed(1), (y + dy).toFixed(1), s, 'tk', anc);
    });
    b += '<rect x="' + (cx - 70) + '" y="' + (cy - 24) + '" width="140" height="48" class="boxa"/>';
    b += st(cx, cy + 5, L('Me + R&D team', 'Ich + F&E-Team', '我 + 研发团队'), 'txw', 'middle');
    return svg(340, b);
  }

  function figNsdi() {
    var b = '<defs><radialGradient id="lobe"><stop offset="0" stop-color="#2f3b4c" stop-opacity=".95"/><stop offset=".55" stop-color="#2f3b4c" stop-opacity=".35"/><stop offset="1" stop-color="#2f3b4c" stop-opacity="0"/></radialGradient></defs>';
    var c = 170, r = 140, ox = 230;
    b += '<rect x="' + (ox - r) + '" y="' + (c - r) + '" width="' + 2 * r + '" height="' + 2 * r + '" class="box"/>';
    b += '<path d="M' + (ox - r) + ' ' + c + ' H' + (ox + r) + ' M' + ox + ' ' + (c - r) + ' V' + (c + r) + '" class="lm"/>';
    b += '<path d="M' + (ox - r) + ' ' + (c + r) + ' L' + (ox + r) + ' ' + (c - r) + '" class="lm dash"/>';
    b += '<ellipse cx="' + (ox - 62) + '" cy="' + (c - 62) + '" rx="78" ry="38" transform="rotate(45 ' + (ox - 62) + ' ' + (c - 62) + ')" fill="url(#lobe)"/>';
    b += '<ellipse cx="' + (ox + 62) + '" cy="' + (c + 62) + '" rx="78" ry="38" transform="rotate(45 ' + (ox + 62) + ' ' + (c + 62) + ')" fill="url(#lobe)"/>';
    b += '<text x="' + (ox + r) + '" y="' + (c + r + 22) + '" class="tx" text-anchor="end">p₁∥ →</text>';
    b += '<text x="' + (ox - r) + '" y="' + (c - r - 10) + '" class="tx">↑ p₂∥</text>';
    var tx = 470;
    b += st(tx, 70, L('Correlated electron momentum distribution', 'Korrelierte Elektronenimpulsverteilung', '双电子关联动量分布'), 'tk');
    b += st(tx, 100, L('Ar atoms, elliptically polarised low-intensity pulses', 'Ar-Atome, elliptisch polarisierte Pulse geringer Intensität', 'Ar 原子，低阈值椭圆偏振激光脉冲'), 'tx');
    b += '<rect x="' + tx + '" y="140" width="14" height="14" class="af"/>';
    b += st(tx + 24, 152, L('Population in quadrants II / IV:', 'Besetzung in Quadrant II / IV:', '分布集中于第二、四象限：'), 'tk');
    b += st(tx + 24, 172, L('electrons leave in opposite directions', 'Elektronen fliegen in entgegengesetzte Richtungen', '两电子沿相反方向出射'), 'tx');
    b += st(tx + 24, 192, L('→ anti-correlation', '→ Antikorrelation', '→ 反关联'), 'txa');
    b += st(tx, 240, L('Reproduced with a QRS model modified', 'Reproduziert mit einem QRS-Modell, erweitert', '采用考虑阈值能量降低的'), 'tx');
    b += st(tx, 260, L('for threshold-energy reduction.', 'um die Absenkung der Schwellenenergie.', '修正 QRS 模型拟合得到。'), 'tx');
    return svg(340, b);
  }

  function figBarrier() {
    var layers = [
      [L('Transparent conductive layer', 'Transparente leitfähige Schicht', '透明导电层'), 'af', 34],
      [L('High-barrier layer', 'Hochbarriereschicht', '高阻隔层'), 'af2', 46],
      [L('Flexible substrate', 'Flexibles Substrat', '柔性基底'), 'rf', 70]
    ];
    var y = 40, b = '';
    layers.forEach(function (ly) {
      b += '<rect x="60" y="' + y + '" width="380" height="' + (ly[2] - 4) + '" class="' + ly[1] + '"/>';
      b += '<path d="M450 ' + (y + ly[2] / 2 - 2) + ' H490" class="ln"/>';
      b += st(500, y + ly[2] / 2 + 3, ly[0], 'tk');
      y += ly[2];
    });
    b += st(60, 26, L('Integrated stack (schematic, not to scale)', 'Integrierter Schichtaufbau (schematisch, nicht maßstäblich)', '一体化叠层结构（示意，非比例）'), 'tx');
    b += st(500, y + 34, L('Goal: one film that blocks moisture/oxygen and conducts', 'Ziel: eine Folie, die Feuchte/Sauerstoff sperrt und leitet', '目标：同一薄膜兼具阻水阻氧与导电功能'), 'txa');
    return svg(230, b);
  }

  // ---------- content ----------
  var P = [
    {
      id: 'heat-seal', group: 'duracell', period: '06/2026 – 09/2026', org: 'Duracell (China)',
      title: L('Heat-Seal Strength Testing Standard', 'Prüfstandard für Siegelnahtfestigkeit', '热封强度测试标准化'),
      sum: L('A testing standard and acceptance method that turns shelf-life seal failures on blister-card battery packaging from a surprise into something predictable.',
        'Ein Prüfstandard und eine Annahmemethodik, die Siegelversagen von Blister-Karten-Verpackungen während der Lagerzeit von einer Überraschung zu einer planbaren Größe machen.',
        '为“吸塑 + 印刷卡”电池包装建立热封强度测试标准与验收方法，把货架期封口失效从事后救火变为可预测、可控制。'),
      methods: 'Test method development · Acceptance criteria · Vendor evaluation',
      metrics: [['100%', L('true-defect detection in pilot', 'Erkennung echter Fehler im Pilot', '试点真实缺陷检出率')], ['≤2%', L('false-hold rate in pilot', 'Fehlsperrquote im Pilot', '试点误扣留率')], ['4', L('vendor proposals evaluated', 'Anbieterangebote bewertet', '家设备供应商方案评估')]],
      sections: [
        ['context', 'p', L(['Seal failures between blister and printed card often showed up only after weeks on the shelf. There was no standard test, so each case was handled reactively.'],
          ['Siegelfehler zwischen Blister und bedruckter Karte zeigten sich oft erst nach Wochen im Regal. Es gab keinen Standardtest, jeder Fall wurde reaktiv bearbeitet.'],
          ['吸塑与印刷卡之间的封口失效往往在上架数周后才暴露。此前没有统一测试标准，只能逐案事后处理。'])],
        ['approach', 'ol', L(['Developed the heat-seal strength testing standard — and caught a mismatch between the test method and the product structure that would have invalidated all data.', 'Designed a “critical failure threshold + aging margin” acceptance method: a sample must exceed the threshold by enough margin at release to survive aging.', 'Evaluated equipment proposals from four vendors and drove the procurement decision.', 'Set up data sharing with suppliers and presented the method to suppliers and leadership.'],
          ['Prüfstandard für die Siegelnahtfestigkeit entwickelt — dabei eine Unstimmigkeit zwischen Prüfmethode und Produktaufbau entdeckt, die alle Daten entwertet hätte.', 'Annahmemethodik „kritische Versagensschwelle + Alterungsreserve“ entworfen: Eine Probe muss bei Freigabe die Schwelle mit genügend Reserve übertreffen, um die Alterung zu überstehen.', 'Geräteangebote von vier Anbietern bewertet und die Beschaffungsentscheidung vorangetrieben.', 'Datenaustausch mit Lieferanten etabliert und die Methode Lieferanten und Management präsentiert.'],
          ['建立热封强度测试标准，并发现测试方法与产品结构不匹配的问题——若不纠正，全部数据都将失效。', '设计“临界失效阈值 + 老化裕量”验收方法：样品在出厂时必须以足够裕量高于阈值，才能撑过老化。', '评估四家供应商的测试设备方案，并推动采购决策。', '建立与供应商的数据共享机制，向供应商和管理层做技术汇报。'])],
        ['result', 'p', L(['In the pilot the method caught every true defect while holding back at most 2% good product — shelf-life seal failures became a controlled, predictable parameter.'],
          ['Im Pilot erkannte die Methode jeden echten Fehler bei höchstens 2 % fälschlich gesperrter Gutteile — Siegelversagen wurde zu einer kontrollierten, vorhersagbaren Größe.'],
          ['试点中该方法检出了全部真实缺陷，误扣留良品不超过 2%——货架期封口失效成为可控、可预测的指标。'])]
      ],
      fig: figHeatSeal
    },
    {
      id: 'anode-weight', group: 'duracell', period: '05/2026 – 08/2026', org: 'Duracell (China) · U2 line',
      title: L('Anode Weight Monitoring & Measurement Reduction', 'Intelligente Überwachung des Anodengewichts', '阳极重量智能监控与测量削减'),
      sum: L('Separating real process drift from measurement artefacts on a high-volume battery line — then using that to cut false alarms, material waste and manual weighing.',
        'Echte Prozessdrift von Messartefakten trennen — an einer Hochvolumen-Batterielinie — und damit Fehlalarme, Materialverlust und manuelle Wägungen reduzieren.',
        '在高产量电池产线上区分真实工艺漂移与测量假象，并据此减少误报、物料浪费和人工称重。'),
      methods: 'X-ray benchmarking · Cg/CgK · Phase-folding · Variance decomposition · Predictive modelling · SPC · PLC audit',
      metrics: [['~90%', L('fewer false SPC alarms', 'weniger SPC-Fehlalarme', 'SPC 误报减少')], ['67%', L('less manual weighing', 'weniger manuelle Wägungen', '人工称重减少')], ['1.2%', L('slurry over-consumption eliminated', 'Slurry-Mehrverbrauch beseitigt', '浆料过量消耗消除')], ['±0.2%', L('model accuracy (session mean)', 'Modellgenauigkeit (Sitzungsmittel)', '模型精度（批次均值）')]],
      sections: [
        ['context', 'p', L(['An inline laser sensor monitored anode weight, but its readings produced frequent SPC alarms and the line relied on extensive manual weighing to stay safe.'],
          ['Ein Inline-Lasersensor überwachte das Anodengewicht, erzeugte aber häufig SPC-Alarme; die Linie verließ sich deshalb auf umfangreiche manuelle Wägungen.'],
          ['产线用在线激光传感器监控阳极重量，但读数频繁触发 SPC 报警，只能依赖大量人工称重兜底。'])],
        ['approach', 'ol', L(['Designed a zero-capex X-ray benchmarking experiment showing the sensor’s “average height” algorithm had essentially no correlation with true weight; drove the vendor to a percentile-based fix, verified weekly with a three-caliber Cg/CgK system.', 'Applied phase-folding to aliased measurements and proved that tank-level cycles drive weight drift (highly significant).', 'Decomposed variance: dosing volume 60%, density 25%, noise 15%.', 'Built a predictive model (±0.2% session-mean accuracy) enabling de-cyclized SPC.', 'Found a fleet-wide calibration bias through a PLC audit and architected a closed-loop framework for automatic volume adjustment.'],
          ['Ein Röntgen-Vergleichsexperiment ohne Investitionskosten entworfen, das zeigte: Der „Durchschnittshöhe“-Algorithmus des Sensors korreliert praktisch nicht mit dem wahren Gewicht; den Anbieter zu einer Perzentil-Lösung gebracht, wöchentlich per Cg/CgK mit drei Kalibern verifiziert.', 'Phase-Folding auf Alias-behaftete Messungen angewandt und nachgewiesen, dass Tankfüllstandszyklen die Gewichtsdrift treiben (hoch signifikant).', 'Varianzzerlegung: Dosiervolumen 60 %, Dichte 25 %, Rauschen 15 %.', 'Vorhersagemodell (±0,2 % Genauigkeit im Sitzungsmittel) für entzyklisierte SPC gebaut.', 'Per SPS-Audit einen anlagenweiten Kalibrier-Bias gefunden und ein Regelkreis-Konzept zur automatischen Volumenanpassung entworfen.'],
          ['设计零投入的 X 射线对标实验，证明传感器“平均高度”算法与真实重量几乎不相关；推动供应商改为百分位算法，并用三规格 Cg/CgK 体系每周验证。', '对存在混叠的测量数据做相位折叠，证明料罐液位周期是重量漂移的驱动因素（高度显著）。', '完成方差分解：体积 60%、密度 25%、噪声 15%。', '建立预测模型（批次均值精度 ±0.2%），实现去周期化 SPC。', '通过 PLC 审计发现全线体系统性标定偏差，并设计体积自动调节的闭环控制框架。'])],
        ['result', 'p', L(['About 90% fewer false alarms, 1.2% slurry over-consumption eliminated, and two-thirds less manual weighing — saving a large volume of test cells every year.'],
          ['Rund 90 % weniger Fehlalarme, 1,2 % Slurry-Mehrverbrauch beseitigt und zwei Drittel weniger manuelle Wägungen — mit einer großen Zahl eingesparter Testzellen pro Jahr.'],
          ['误报减少约 90%，消除 1.2% 的浆料过量消耗，人工称重减少三分之二，每年节省大量测试电芯。'])]
      ],
      fig: figAnode
    },
    {
      id: 'rca-slurry', group: 'duracell', period: '01/2026 – 05/2026', org: 'Duracell (China)',
      title: L('Root Cause: “Missing Slurry” False Rejects', 'Ursachenanalyse: Fehlausschuss „fehlende Slurry“', '根因调查：阳极高度缺浆误判'),
      sum: L('A cross-functional investigation proving that a persistent defect was a sensor misjudgement, not a material problem.',
        'Eine bereichsübergreifende Untersuchung, die zeigte: Ein hartnäckiger Fehler war eine Fehlbewertung des Sensors, kein Materialproblem.',
        '一次跨部门根因调查，证明长期存在的“缺陷”其实是传感器误判，而非物料问题。'),
      methods: 'UPS · 6W2H · Fishbone · Cause & Effect verification · Repeatability testing',
      metrics: [['~90%', L('less false-reject scrap', 'weniger Fehlausschuss', '误判报废减少')], ['6 → 2', L('candidate factors → root causes', 'Einflussfaktoren → Ursachen', '候选因素 → 根因')]],
      sections: [
        ['context', 'p', L(['A recurring “missing slurry at anode height” reject was scrapping cells well above target, shift after shift.'],
          ['Ein wiederkehrender Ausschuss „fehlende Slurry auf Anodenhöhe“ lag Schicht für Schicht deutlich über dem Ziel.'],
          ['“阳极高度缺浆”剔除长期居高不下，每班报废量远超目标。'])],
        ['approach', 'ol', L(['Led a cross-functional UPS investigation using 6W2H, fishbone analysis and cause-and-effect verification to narrow six candidate factors.', 'Diagnosed a dual root cause: a laser-sensor calibration mismatch after a formula changeover, plus specular reflection from excess free electrolyte.', 'Confirmed by weight verification, dimensional cross-checks and repeatability tests that the rejects were sensor misjudgements, not material defects.', 'Executed a targeted equipment adjustment and a controlled electrolyte validation test.'],
          ['Eine bereichsübergreifende UPS-Untersuchung mit 6W2H, Ishikawa und Ursache-Wirkungs-Verifikation geleitet, um sechs Einflussfaktoren einzugrenzen.', 'Doppelte Ursache gefunden: Kalibrierabweichung des Lasersensors nach einem Rezepturwechsel sowie Spiegelreflexion durch überschüssigen freien Elektrolyt.', 'Per Gewichtsprüfung, Maßabgleich und Wiederholbarkeitstests bestätigt, dass es Fehlbewertungen des Sensors waren, keine Materialfehler.', 'Gezielte Anlagenanpassung und einen kontrollierten Elektrolyt-Validierungstest umgesetzt.'],
          ['主导跨部门 UPS 调查，运用 6W2H、鱼骨图和因果验证，从六个候选因素中逐步收敛。', '锁定双重根因：配方切换后激光传感器标定不匹配，以及过量游离电解液造成的镜面反射干扰。', '通过称重验证、尺寸交叉核对和重复性测试，确认剔除品是传感器误判而非物料缺陷。', '实施针对性设备调整，并开展受控的电解液验证试验。'])],
        ['result', 'p', L(['False-reject scrap fell by about 90% and has stayed well below the target since.'],
          ['Der Fehlausschuss sank um rund 90 % und liegt seither stabil deutlich unter dem Ziel.'],
          ['误判报废降低约 90%，并持续稳定在目标值以下。'])]
      ],
      fig: figRca
    },
    {
      id: 'quanta-yield', group: 'axxon', period: '10/2024 – 11/2024', org: 'AXXON · Quanta Shanghai',
      title: L('Yield Recovery after a Substrate Change', 'Ausbeute nach Substratwechsel wiederhergestellt', '上海广达良率提升'),
      sum: L('The client switched substrate supplier and existing dispensing parameters stopped working. I went on site, found the cause and closed it.',
        'Der Kunde wechselte den Substratlieferanten, die bisherigen Dosierparameter funktionierten nicht mehr. Ich war vor Ort, fand die Ursache und schloss das Problem ab.',
        '客户更换基板供应商后，原有点胶参数在新基板上表现不佳。我赴现场找到根因并闭环解决。'),
      methods: 'On-site root cause analysis · Interim containment · Stakeholder communication',
      sections: [
        ['context', 'p', L(['Material differences in the new substrate caused a yield drop on an Apple supply-chain line, with turnover pressure on all sides.'],
          ['Materialunterschiede im neuen Substrat führten auf einer Linie der Apple-Lieferkette zu Ausbeuteverlust und Lieferdruck auf allen Seiten.'],
          ['新基板材料差异导致苹果供应链产线良率下降，各方出货压力很大。'])],
        ['approach', 'ol', L(['Travelled to the site, observed the process and identified the influencing factors.', 'Delivered an interim fix that lifted yield enough to relieve turnover pressure.', 'Identified the root cause, decided to replace the dispensing needles and implemented the change.', 'Kept trust between Quanta, Bozhong and Apple through transparent communication.'],
          ['Vor Ort den Prozess beobachtet und die Einflussfaktoren identifiziert.', 'Eine Übergangslösung umgesetzt, die die Ausbeute so weit hob, dass der Lieferdruck nachließ.', 'Die Ursache gefunden, den Austausch der Dosiernadeln entschieden und umgesetzt.', 'Durch transparente Kommunikation das Vertrauen zwischen Quanta, Bozhong und Apple gehalten.'],
          ['赴现场观察实际情况，识别影响因素。', '提出临时方案，小幅提升良率，缓解出货压力。', '找到根因，决定更换针头并落地实施，彻底解决问题。', '在广达、博众与苹果之间保持沟通，维护各方信任。'])],
        ['result', 'p', L(['Yield recovered and the issue was closed without losing the client’s trust.'],
          ['Die Ausbeute erholte sich, das Problem wurde abgeschlossen, ohne das Vertrauen des Kunden zu verlieren.'],
          ['良率恢复，问题闭环，客户信任得以维持。'])]
      ],
      fig: function () { return flow([L('Supplier|change', 'Lieferanten-|wechsel', '基板|换供应商'), L('Yield|drop', 'Ausbeute-|verlust', '良率|下降'), L('On-site|analysis', 'Analyse|vor Ort', '现场|分析'), L('Interim|fix', 'Übergangs-|lösung', '临时|方案'), L('Needle|replacement', 'Nadel-|tausch', '更换|针头'), L('Closed', 'Abge-|schlossen', '闭环')], [2, 4]); }
    },
    {
      id: 'auto-valve', group: 'axxon', period: '11/2024 – 01/2025', org: 'AXXON · Apple automated factory',
      title: L('Automatic Adhesive & Valve Replacement', 'Automatischer Kleber- und Ventilwechsel', '自动换胶换阀 Demo'),
      sum: L('Upgrading manual adhesive and valve changes on a dispensing machine to a fully automatic process for a fully automated factory.',
        'Den manuellen Kleber- und Ventilwechsel an einer Dosieranlage für eine vollautomatisierte Fabrik auf einen vollautomatischen Ablauf umgestellt.',
        '按全自动化工厂要求，把点胶机的人工换胶、换阀升级为全自动流程。'),
      methods: 'On-machine testing · Rework coordination · Client acceptance · Module iteration',
      sections: [
        ['context', 'p', L(['Apple required a fully automated factory, so the manual adhesive and valve replacement on the dispensing machine had to become automatic.'],
          ['Apple forderte eine vollautomatisierte Fabrik; der manuelle Kleber- und Ventilwechsel der Dosieranlage musste daher automatisiert werden.'],
          ['苹果要求打造全自动化工厂，点胶机原本的人工换胶、换阀必须升级为自动。'])],
        ['approach', 'ol', L(['Ran on-machine testing of the new replacement modules.', 'Coordinated internal rework or redesign of components that did not meet standard.', 'Travelled to the client site for acceptance once standards were met.', 'Iterated new adhesive and valve modules based on client feedback.'],
          ['Maschinentests der neuen Wechselmodule durchgeführt.', 'Interne Nacharbeit bzw. Neukonstruktion nicht konformer Bauteile koordiniert.', 'Nach Erfüllung der Standards die Abnahme beim Kunden vor Ort begleitet.', 'Neue Kleber- und Ventilmodule anhand von Kundenfeedback weiterentwickelt.'],
          ['负责新模组的上机测试。', '对不达标部件协调内部返工或重新设计。', '达标后赴客户现场进行验收。', '根据客户反馈迭代新的换胶、换阀模组。'])]
      ],
      fig: function () { return flow([L('Manual|change', 'Manueller|Wechsel', '人工|换胶换阀'), L('Auto|module', 'Auto-|Modul', '自动|模组'), L('On-machine|test', 'Maschinen-|test', '上机|测试'), L('Rework', 'Nach-|arbeit', '返工'), L('Client|acceptance', 'Kunden-|abnahme', '客户|验收'), L('Iteration', 'Iteration', '迭代')], [2, 4]); }
    },
    {
      id: 'pneumatic-electric', group: 'axxon', period: '12/2024 – 03/2025', org: 'AXXON · Huawei',
      title: L('Pneumatic-to-Electric Conversion', 'Umrüstung von Pneumatik auf Elektrik', '华为气改电项目'),
      sum: L('Converting pneumatic equipment to electric drives so the client could remove compressed-air supply from the factory.',
        'Pneumatische Anlagen auf elektrische Antriebe umgerüstet, damit der Kunde die Druckluftversorgung aus der Fabrik entfernen konnte.',
        '将气动设备改为电动，帮助客户取消工厂供气单元。'),
      methods: 'Solution evaluation · On-machine testing · Client acceptance',
      sections: [
        ['context', 'p', L(['The client aimed to eliminate air-supply units in the factory and convert all pneumatic equipment to electric.'],
          ['Der Kunde wollte die Druckluftaggregate in der Fabrik abschaffen und alle pneumatischen Anlagen auf elektrisch umstellen.'],
          ['客户希望取消工厂内的供气单元，把所有气动设备改为电动。'])],
        ['approach', 'ol', L(['Discussed and evaluated technical solutions.', 'Ran on-machine testing.', 'Coordinated internal rework of parts that did not meet standard.', 'Coordinated acceptance with the client once standards were met.'],
          ['Technische Lösungen diskutiert und bewertet.', 'Maschinentests durchgeführt.', 'Interne Nacharbeit nicht konformer Teile koordiniert.', 'Nach Erfüllung der Standards die Abnahme mit dem Kunden koordiniert.'],
          ['讨论并评估技术方案。', '负责上机测试。', '对不达标零件协调内部返工。', '达标后与客户协调验收。'])]
      ],
      fig: function () { return flow([L('Pneumatic|equipment', 'Pneumatische|Anlage', '气动|设备'), L('Solution|evaluation', 'Lösungs-|bewertung', '方案|评估'), L('On-machine|test', 'Maschinen-|test', '上机|测试'), L('Rework', 'Nach-|arbeit', '返工'), L('Electric,|accepted', 'Elektrisch,|abgenommen', '电动化|验收')], [1, 2]); }
    },
    {
      id: 'megmeet-dispensing', group: 'axxon', period: '05/2025 – 06/2025', org: 'AXXON · MEGMEET',
      title: L('Flip & Double-Side Dispensing in One System', 'Wenden und beidseitiges Dosieren in einem System', '麦格米特内翻转双面点胶'),
      sum: L('Equipment that flips a part and dispenses on both sides within a single system.',
        'Eine Anlage, die ein Bauteil wendet und in einem einzigen System beidseitig dosiert.',
        '在同一系统内完成工件翻转与双面点胶的设备。'),
      methods: 'On-machine testing · Rework coordination · Client acceptance',
      sections: [
        ['context', 'p', L(['The client wanted flipping and double-side dispensing handled inside one machine instead of separate stations.'],
          ['Der Kunde wollte Wenden und beidseitiges Dosieren in einer Maschine statt in getrennten Stationen.'],
          ['客户希望在一台设备内完成翻转与双面点胶，而不是分站完成。'])],
        ['approach', 'ol', L(['Ran on-machine testing.', 'Coordinated internal rework of components that did not meet standard.', 'Coordinated acceptance with the client once standards were met.'],
          ['Maschinentests durchgeführt.', 'Interne Nacharbeit nicht konformer Bauteile koordiniert.', 'Nach Erfüllung der Standards die Abnahme mit dem Kunden koordiniert.'],
          ['负责上机测试。', '对不达标部件协调内部返工。', '达标后与客户协调验收。'])]
      ],
      fig: function () { return flow([L('Load', 'Laden', '上料'), L('Dispense|side A', 'Dosieren|Seite A', 'A 面|点胶'), L('Internal|flip', 'Internes|Wenden', '内部|翻转'), L('Dispense|side B', 'Dosieren|Seite B', 'B 面|点胶'), L('Unload', 'Entladen', '下料')], [2]); }
    },
    {
      id: 'field-support', group: 'axxon', period: '10/2024 – 07/2025', org: 'AXXON · Huawei / Foxconn / PCBA group',
      title: L('Multi-site Field Support', 'Standortübergreifender Field Support', '多基地维护支持'),
      sum: L('Day-to-day issue handling for eight client sites in China and India — diagnosing on site, containing, and leading R&D to the fix.',
        'Tägliche Problembearbeitung für acht Kundenstandorte in China und Indien — Diagnose vor Ort, Eindämmung und Führung der F&E bis zur Lösung.',
        '负责中国与印度共八个客户基地的日常问题处理——现场诊断、临时遏制，并带领研发闭环。'),
      methods: 'On-site diagnosis · Containment · Resource coordination · Customisation requests',
      metrics: [['8', L('client sites', 'Kundenstandorte', '个客户基地')], ['2', L('countries', 'Länder', '个国家')]],
      sections: [
        ['context', 'p', L(['Huawei (Precision, Terminal, Honor), Foxconn Taiyuan and four PCBA group sites — Qinhuangdao, Shenzhen, Huai’an and India — all running AXXON equipment.'],
          ['Huawei (Precision, Terminal, Honor), Foxconn Taiyuan und vier Standorte einer PCBA-Gruppe — Qinhuangdao, Shenzhen, Huai’an und Indien — alle mit AXXON-Anlagen.'],
          ['华为（精密、终端、荣耀）、太原富士康，以及 PCBA 集团的秦皇岛、深圳、淮安、印度四个基地，均使用轴心设备。'])],
        ['approach', 'ol', L(['Travelled to sites for first-hand observation.', 'Reassured clients and secured internal manpower and resources.', 'Provided interim solutions to relieve pressure on the line.', 'Led R&D colleagues to resolve issues or deliver customisation requests.'],
          ['Für Beobachtungen aus erster Hand an die Standorte gereist.', 'Kunden beruhigt und intern Personal und Ressourcen gesichert.', 'Übergangslösungen geliefert, um die Linie zu entlasten.', 'F&E-Kollegen bis zur Lösung bzw. Umsetzung von Kundenwünschen geführt.'],
          ['赴现场实地观察。', '安抚客户，并在内部争取人力与资源。', '提供临时方案，缓解现场压力。', '带领研发同事解决现场问题或完成定制需求。'])]
      ],
      fig: figSupport
    },
    {
      id: 'nsdi', group: 'academic', period: '09/2022 – 09/2023', org: 'Shantou University',
      title: L('Anti-correlation in Non-sequential Double Ionization', 'Antikorrelation bei nicht-sequentieller Doppelionisation', '椭偏场下非顺序双电离的反关联'),
      sum: L('Numerical strong-field physics: explaining why two electrons leave an argon atom in opposite directions under elliptically polarised laser pulses.',
        'Numerische Starkfeldphysik: Warum zwei Elektronen ein Argonatom unter elliptisch polarisierten Laserpulsen in entgegengesetzte Richtungen verlassen.',
        '强场物理数值研究：解释椭圆偏振激光脉冲下氩原子两个电子为何沿相反方向出射。'),
      methods: 'TDSE · QRS model · FORTRAN · Linux',
      sections: [
        ['context', 'p', L(['At low intensities, non-sequential double ionization of Ar shows an anti-correlated momentum distribution that standard rescattering models do not reproduce well.'],
          ['Bei geringen Intensitäten zeigt die nicht-sequentielle Doppelionisation von Ar eine antikorrelierte Impulsverteilung, die Standard-Rückstreumodelle schlecht abbilden.'],
          ['低光强下，Ar 原子的非顺序双电离呈现反关联动量分布，标准再散射模型难以很好地复现。'])],
        ['approach', 'ol', L(['Coordinated with the advisor and managed team tasks and progress.', 'Calculated the threshold-energy reduction and the momentum distribution of collision-excited scattered electrons.', 'Determined the tunnelling start time of excited-state electrons and reconstructed the electric field accordingly.', 'Solved the time-dependent Schrödinger equation to simulate the momentum distribution of excited-state tunnelling ionization.', 'Modified the QRS model to include threshold-energy reduction.'],
          ['Abstimmung mit dem Betreuer, Koordination von Aufgaben und Fortschritt im Team.', 'Absenkung der Schwellenenergie und Impulsverteilung stoßangeregter Streuelektronen berechnet.', 'Tunnelstartzeit angeregter Elektronen bestimmt und das elektrische Feld entsprechend rekonstruiert.', 'Die zeitabhängige Schrödingergleichung gelöst, um die Impulsverteilung der Tunnelionisation aus angeregten Zuständen zu simulieren.', 'Das QRS-Modell um die Absenkung der Schwellenenergie erweitert.'],
          ['与导师沟通，协调团队任务与进度。', '计算阈值能量降低量及碰撞激发散射电子的动量分布。', '确定激发态电子隧穿电离起始时刻，并据此重构电场。', '求解含时薛定谔方程，模拟激发态电子隧穿电离的动量分布。', '在 QRS 模型中引入阈值能量降低进行修正。'])],
        ['result', 'p', L(['The modified QRS model successfully fitted the anti-correlated NSDI distribution of Ar under low-threshold elliptical pulses.'],
          ['Das erweiterte QRS-Modell bildete die antikorrelierte NSDI-Verteilung von Ar unter elliptischen Pulsen niedriger Schwelle erfolgreich ab.'],
          ['修正后的 QRS 模型成功拟合了低阈值椭圆偏振脉冲下 Ar 原子 NSDI 的反关联分布。'])]
      ],
      fig: figNsdi
    },
    {
      id: 'barrier-film', group: 'academic', period: '10/2023 – 06/2024', org: 'Shantou University · B.Sc. thesis',
      title: L('Integrated High-Barrier Film & Transparent Electrode', 'Integrierte Hochbarrierefolie mit transparenter Elektrode', '一体化高阻隔膜与透明电极研究'),
      sum: L('Lab research on a single film that combines a moisture/oxygen barrier with a transparent electrode.',
        'Laborforschung an einer Folie, die eine Feuchte-/Sauerstoffbarriere mit einer transparenten Elektrode vereint.',
        '实验室研究：在同一薄膜上同时实现阻水阻氧与透明导电。'),
      methods: 'Thin-film deposition · Structural characterisation · Literature review · Scientific writing',
      sections: [
        ['approach', 'ol', L(['Coordinated equipment use and timelines with supervisors and senior researchers.', 'Reviewed the literature to frame the project.', 'Explored experimental conditions and produced qualified samples.', 'Performed tests and structural characterisation.', 'Drafted the research paper.'],
          ['Gerätenutzung und Zeitpläne mit Betreuern und erfahrenen Forschenden abgestimmt.', 'Literaturrecherche zur Einordnung des Projekts.', 'Versuchsbedingungen erkundet und qualifizierte Proben hergestellt.', 'Prüfungen und Strukturcharakterisierung durchgeführt.', 'Die Forschungsarbeit entworfen.'],
          ['与导师及师兄师姐协调设备使用与项目进度。', '查阅文献，理解课题背景。', '探索最佳实验条件，制备合格样品。', '完成各项测试与结构表征。', '撰写研究论文初稿。'])],
        ['result', 'p', L(['Replicated published results under the available conditions, identified the optimal conditions for conductive-layer deposition, and completed all required testing and analysis.'],
          ['Veröffentlichte Ergebnisse unter den vorhandenen Bedingungen reproduziert, optimale Bedingungen für die Abscheidung der leitfähigen Schicht ermittelt und alle Prüfungen und Analysen abgeschlossen.'],
          ['在现有条件下复现了文献结果，确定了导电层沉积的最佳条件，并完成全部测试与分析。'])]
      ],
      fig: figBarrier
    }
  ];

  P.forEach(function (p, i) { p.no = 'P' + String(i + 1).padStart(2, '0'); });

  // ---------- renderers ----------
  function renderList(el) {
    var html = '';
    GROUPS.forEach(function (g) {
      html += '<h3 class="sub">' + t(g.name) + '</h3>';
      P.filter(function (p) { return p.group === g.id; }).forEach(function (p) {
        html += '<a class="proj" href="project.html?id=' + p.id + '">' +
          '<span class="no">' + p.no + '</span>' +
          '<span class="t">' + t(p.title) + '<small>' + esc(p.org) + '</small></span>' +
          '<span class="when">' + p.period + '</span><span class="go">→</span></a>';
      });
    });
    el.innerHTML = html;
  }

  function renderProject(el, id) {
    var i = 0;
    P.forEach(function (p, k) { if (p.id === id) i = k; });
    var p = P[i], prev = P[(i + P.length - 1) % P.length], next = P[(i + 1) % P.length];
    // main.js picks the title for the current language from these attributes
    var html = document.documentElement;
    html.setAttribute('data-title-en', p.title.en + ' — Cheng Luoluo (Zrin)');
    html.setAttribute('data-title-de', p.title.de + ' — Cheng Luoluo (Zrin)');
    html.setAttribute('data-title-zh', p.title.zh + ' — 程络络 (Zrin)');
    document.title = p.title.en + ' — Cheng Luoluo (Zrin)';

    var h = '<div class="wrap crumb"><a href="index.html#projects">' + t(LBL.back) + '</a></div>';
    h += '<header class="wrap p-head grid"><div class="no">' + p.no + '</div><h1>' + t(p.title) + '</h1><p class="sum">' + t(p.sum) + '</p></header>';
    h += '<section class="meta"><div class="wrap grid">' +
      '<div class="m"><span>' + t(LBL.period) + '</span>' + p.period + '</div>' +
      '<div class="m"><span>' + t(LBL.role) + '</span>' + t(LBL.lead) + '</div>' +
      '<div class="m"><span>' + t(LBL.org) + '</span>' + esc(p.org) + '</div>' +
      '<div class="m"><span>' + t(LBL.methods) + '</span>' + esc(p.methods) + '</div></div></section>';
    h += '<div class="wrap"><figure class="ph p-img" data-ph="images/' + p.id + '.jpg"><img src="images/' + p.id + '.jpg" alt=""></figure></div>';
    if (p.metrics) {
      h += '<section class="p-metrics"><div class="wrap grid stats-in">';
      p.metrics.forEach(function (m) { h += '<div class="stat"><b>' + m[0] + '</b><span>' + t(m[1]) + '</span></div>'; });
      h += '</div></section>';
    }
    p.sections.forEach(function (s, k) {
      var body = ['en', 'de', 'zh'].map(function (l) {
        var items = s[2][l];
        if (s[1] === 'ol') return '<ol data-l="' + l + '">' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
        return '<div data-l="' + l + '">' + items.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div>';
      }).join('');
      h += '<section class="p-sec"><div class="wrap grid"><div class="sec-label"><span class="n">' + String(k + 1).padStart(2, '0') + '</span>' + t(LBL[s[0]]) + '</div><div class="sec-body">' + body + '</div></div></section>';
    });
    if (p.fig) {
      var cap = ['heat-seal', 'anode-weight', 'rca-slurry', 'nsdi'].indexOf(p.id) > -1 ? t(LBL.illus) : '';
      h += '<section class="p-sec"><div class="wrap grid"><div class="sec-label"><span class="n">' + String(p.sections.length + 1).padStart(2, '0') + '</span>' + t(LBL.figure) + '</div>' +
        '<div class="sec-body"><figure class="fig">' + p.fig() + (cap ? '<figcaption>' + cap + '</figcaption>' : '') + '</figure></div></div></section>';
    }
    h += '<nav class="pager"><div class="wrap">' +
      '<a href="project.html?id=' + prev.id + '">← ' + t(LBL.prev) + '<b>' + t(prev.title) + '</b></a>' +
      '<a class="next" href="project.html?id=' + next.id + '">' + t(LBL.next) + ' →<b>' + t(next.title) + '</b></a></div></nav>';
    el.innerHTML = h;
  }

  window.SiteProjects = { list: renderList, project: renderProject };
})();

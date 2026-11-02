/* ==========================================================================
   LTIA Package 5.10 (HBS & SSE) - Overall Floor Plans Catalog & 234 Machine Coordinates
   Direct Layout Coordinates on 7 Approved Overall Floor Plans (00001)
   Aligned with Structural Grid Axes & Detailed Zone Drawings (10001..10021)
   ========================================================================== */

const DRAWINGS_CATALOG = {
  HBS_LA_GF_00001: {
    id: "HBS_LA_GF_00001",
    code: "LTIA1-PTB-PMI-HBS3-LA-GF-XX-00001",
    system: "HBS",
    floor: "GF",
    kind: "OVERALL",
    zone_label: "HBS Tầng Trệt (GF)",
    title: "HBS - Mặt bằng tổng thể Tầng Trệt (GF) - 19 tuyến Arrival AR01..AR14, 2 RTT110 Make-up L3, 2 Transfer, 2 OOG 632DV, 2 ETD (27 máy)",
    scale: "A1 - 1:500",
    img_url: "/drawings/HBS_LA_GF_00001.jpg",
    pdf_url: "/api/pdf/HBS_LA_GF_00001",
  },
  HBS_LA_2F_00001: {
    id: "HBS_LA_2F_00001",
    code: "LTIA1-PTB-PMI-HBS3-LA-2F-XX-00001",
    system: "HBS",
    floor: "2F",
    kind: "OVERALL",
    zone_label: "HBS Tầng 2 (2F)",
    title: "HBS - Mặt bằng tổng thể Tầng 2 (2F) - Soi chiếu Sơ cấp 10 máy CT RTT110 (Tây W1..W5 & Đông E1..E5) & Matrix 30 CMS (13 máy)",
    scale: "A1 - 1:500",
    img_url: "/drawings/HBS_LA_2F_00001.jpg",
    pdf_url: "/api/pdf/HBS_LA_2F_00001",
  },
  HBS_LA_3F_00001: {
    id: "HBS_LA_3F_00001",
    code: "LTIA1-PTB-PMI-HBS3-LA-3F-XX-00001",
    system: "HBS",
    floor: "3F",
    kind: "OVERALL",
    zone_label: "HBS Tầng 3 (3F)",
    title: "HBS - Mặt bằng tổng thể Tầng 3 (3F) - 8 Đảo Check-in A..H (16 máy 928DX) & 2 Quầy OOG (2 máy 928DX + 2 ETD) (20 máy)",
    scale: "A1 - 1:500",
    img_url: "/drawings/HBS_LA_3F_00001.jpg",
    pdf_url: "/api/pdf/HBS_LA_3F_00001",
  },
  SSE_LA_GF_00001: {
    id: "SSE_LA_GF_00001",
    code: "LTIA1-PTB-PMI-SSE3-LA-GF-XX-00001",
    system: "SSE",
    floor: "GF",
    kind: "OVERALL",
    zone_label: "SSE Tầng Trệt (GF)",
    title: "SSE - Mặt bằng tổng thể Tầng Trệt (GF) - Điểm KT An ninh VIP (Tây/Đông) & Nhân viên/Hàng hóa (Staff & Goods) (22 máy)",
    scale: "A1 - 1:500",
    img_url: "/drawings/SSE_LA_GF_00001.jpg",
    pdf_url: "/api/pdf/SSE_LA_GF_00001",
  },
  SSE_LA_1F_00001: {
    id: "SSE_LA_1F_00001",
    code: "LTIA1-PTB-PMI-SSE3-LA-1F-XX-00001",
    system: "SSE",
    floor: "1F",
    kind: "OVERALL",
    zone_label: "SSE Tầng 1 (1F)",
    title: "SSE - Mặt bằng tổng thể Tầng 1 (1F) - Hải quan Hành lý Đến (928DX, 632DV, 16 RFID) & Trung chuyển Transfer (33 máy)",
    scale: "A1 - 1:500",
    img_url: "/drawings/SSE_LA_1F_00001.jpg",
    pdf_url: "/api/pdf/SSE_LA_1F_00001",
  },
  SSE_LA_2F_00001: {
    id: "SSE_LA_2F_00001",
    code: "LTIA1-PTB-PMI-SSE3-LA-2F-XX-00001",
    system: "SSE",
    floor: "2F",
    kind: "OVERALL",
    zone_label: "SSE Tầng 2 (2F)",
    title: "SSE - Mặt bằng tổng thể Tầng 2 (2F) - Trung tâm Dữ liệu SSE CMS (Data Center DC1/DC2 & FDR) (3 máy)",
    scale: "A1 - 1:500",
    img_url: "/drawings/SSE_LA_2F_00001.jpg",
    pdf_url: "/api/pdf/SSE_LA_2F_00001",
  },
  SSE_LA_3F_00001: {
    id: "SSE_LA_3F_00001",
    code: "LTIA1-PTB-PMI-SSE3-LA-3F-XX-00001",
    system: "SSE",
    floor: "3F",
    kind: "OVERALL",
    zone_label: "SSE Tầng 3 (3F)",
    title: "SSE - Mặt bằng tổng thể Tầng 3 (3F) - 28 Làn Soi chiếu Khởi hành (920CT, TRS 19.5m, QPS201, Metor 6E) & 3 Điểm Nhân viên (116 máy)",
    scale: "A1 - 1:500",
    img_url: "/drawings/SSE_LA_3F_00001.jpg",
    pdf_url: "/api/pdf/SSE_LA_3F_00001",
  },
};

const EXACT_MACHINE_COORDS = {
  "HBS-RTT110-2F-E-01": {
    "dwg": "HBS_LA_2F_00001",
    "x": 58.6,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E1 (Trục B10-B11, giữa NG-NH)"
  },
  "HBS-RTT110-2F-E-02": {
    "dwg": "HBS_LA_2F_00001",
    "x": 60.05,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E2 (Trục B11-B12, giữa NG-NH)"
  },
  "HBS-RTT110-2F-E-03": {
    "dwg": "HBS_LA_2F_00001",
    "x": 61.5,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E3 (Trục B12-B13, giữa NG-NH)"
  },
  "HBS-RTT110-2F-E-04": {
    "dwg": "HBS_LA_2F_00001",
    "x": 62.95,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E4 (Trục B13-B14, giữa NG-NH)"
  },
  "HBS-RTT110-2F-E-05": {
    "dwg": "HBS_LA_2F_00001",
    "x": 64.4,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E5 (Trục B14-B15, giữa NG-NH)"
  },
  "HBS-RTT110-2F-W-01": {
    "dwg": "HBS_LA_2F_00001",
    "x": 24.6,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W1 (Trục A15-A14, giữa NG-NH)"
  },
  "HBS-RTT110-2F-W-02": {
    "dwg": "HBS_LA_2F_00001",
    "x": 26.05,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W2 (Trục A14-A13, giữa NG-NH)"
  },
  "HBS-RTT110-2F-W-03": {
    "dwg": "HBS_LA_2F_00001",
    "x": 27.5,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W3 (Trục A13-A12, giữa NG-NH)"
  },
  "HBS-RTT110-2F-W-04": {
    "dwg": "HBS_LA_2F_00001",
    "x": 28.95,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W4 (Trục A12-A11, giữa NG-NH)"
  },
  "HBS-RTT110-2F-W-05": {
    "dwg": "HBS_LA_2F_00001",
    "x": 30.4,
    "y": 53.8,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W5 (Trục A11-A10, giữa NG-NH)"
  },
  "HBS-CMS-MATRIX30-01": {
    "dwg": "HBS_LA_2F_00001",
    "x": 44.0,
    "y": 57.5,
    "pos_desc": "2F Phòng Kỹ thuật Máy chủ Trung tâm - Tủ Matrix 30 Rack #1 (Trục AB01)"
  },
  "HBS-CMS-MATRIX30-02": {
    "dwg": "HBS_LA_2F_00001",
    "x": 44.7,
    "y": 57.5,
    "pos_desc": "2F Phòng Kỹ thuật Máy chủ Trung tâm - Tủ Matrix 30 Rack #2 (Trục AB01)"
  },
  "HBS-CMS-MATRIX30-03": {
    "dwg": "HBS_LA_2F_00001",
    "x": 45.4,
    "y": 57.5,
    "pos_desc": "2F Phòng Kỹ thuật Máy chủ Trung tâm - Tủ Matrix 30 Rack #3 (Trục AB01)"
  },
  "HBS-ETD-3F-OOG-01": {
    "dwg": "HBS_LA_3F_00001",
    "x": 18.5,
    "y": 72.8,
    "pos_desc": "3F Quầy Hành lý Quá khổ OOG Cánh Tây (Trục A18-A19) - Máy 928DX"
  },
  "HBS-ETD-3F-OOG-02": {
    "dwg": "HBS_LA_3F_00001",
    "x": 70.5,
    "y": 72.8,
    "pos_desc": "3F Quầy Hành lý Quá khổ OOG Cánh Đông (Trục B15-B16) - Máy 928DX"
  },
  "HBS-928DX-3F-OOG-01": {
    "dwg": "HBS_LA_3F_00001",
    "x": 18.5,
    "y": 72.8,
    "pos_desc": "3F Quầy Hành lý Quá khổ OOG Cánh Tây (Trục A18-A19) - Máy 928DX"
  },
  "HBS-928DX-3F-OOG-02": {
    "dwg": "HBS_LA_3F_00001",
    "x": 70.5,
    "y": 72.8,
    "pos_desc": "3F Quầy Hành lý Quá khổ OOG Cánh Đông (Trục B15-B16) - Máy 928DX"
  },
  "HBS-928DX-3F-INT-01": {
    "dwg": "HBS_LA_3F_00001",
    "x": 22.8,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế A (Trục A15-A14) - Máy 928DX #1"
  },
  "HBS-928DX-3F-INT-02": {
    "dwg": "HBS_LA_3F_00001",
    "x": 24.2,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế A (Trục A15-A14) - Máy 928DX #2"
  },
  "HBS-928DX-3F-INT-03": {
    "dwg": "HBS_LA_3F_00001",
    "x": 27.3,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế B (Trục A12-A11) - Máy 928DX #1"
  },
  "HBS-928DX-3F-INT-04": {
    "dwg": "HBS_LA_3F_00001",
    "x": 28.7,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế B (Trục A12-A11) - Máy 928DX #2"
  },
  "HBS-928DX-3F-INT-05": {
    "dwg": "HBS_LA_3F_00001",
    "x": 31.8,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế C (Trục A9-A8) - Máy 928DX #1"
  },
  "HBS-928DX-3F-INT-06": {
    "dwg": "HBS_LA_3F_00001",
    "x": 33.2,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế C (Trục A9-A8) - Máy 928DX #2"
  },
  "HBS-928DX-3F-INT-07": {
    "dwg": "HBS_LA_3F_00001",
    "x": 36.3,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế D (Trục A6-A5) - Máy 928DX #1"
  },
  "HBS-928DX-3F-INT-08": {
    "dwg": "HBS_LA_3F_00001",
    "x": 37.7,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế D (Trục A6-A5) - Máy 928DX #2"
  },
  "HBS-928DX-3F-INT-09": {
    "dwg": "HBS_LA_3F_00001",
    "x": 60.3,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế G (Trục B9-B10) - Máy 928DX #1"
  },
  "HBS-928DX-3F-INT-10": {
    "dwg": "HBS_LA_3F_00001",
    "x": 61.7,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế G (Trục B9-B10) - Máy 928DX #2"
  },
  "HBS-928DX-3F-INT-11": {
    "dwg": "HBS_LA_3F_00001",
    "x": 64.8,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế H (Trục B12-B13) - Máy 928DX #1"
  },
  "HBS-928DX-3F-INT-12": {
    "dwg": "HBS_LA_3F_00001",
    "x": 66.2,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế H (Trục B12-B13) - Máy 928DX #2"
  },
  "HBS-928DX-3F-INT-13": {
    "dwg": "HBS_LA_3F_00001",
    "x": 34.5,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế C-D Bổ sung (Trục A8-A7) - Máy 928DX #1"
  },
  "HBS-928DX-3F-INT-14": {
    "dwg": "HBS_LA_3F_00001",
    "x": 39.0,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc tế D Bổ sung (Trục A5-A4) - Máy 928DX #2"
  },
  "HBS-928DX-3F-DOM-01": {
    "dwg": "HBS_LA_3F_00001",
    "x": 52.0,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc nội E (Trục B3-B4, ND-NE)"
  },
  "HBS-928DX-3F-DOM-02": {
    "dwg": "HBS_LA_3F_00001",
    "x": 56.5,
    "y": 72.5,
    "pos_desc": "3F Đảo Check-in Quốc nội F (Trục B6-B7, ND-NE)"
  },
  "HBS-928DX-GF-ARR-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 17.8,
    "y": 69.6,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR01 Cánh Tây (Trục A22)"
  },
  "HBS-928DX-GF-ARR-02": {
    "dwg": "HBS_LA_GF_00001",
    "x": 20.25,
    "y": 71.8,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR02 Cánh Tây (Trục A20)"
  },
  "HBS-928DX-GF-ARR-03": {
    "dwg": "HBS_LA_GF_00001",
    "x": 22.7,
    "y": 69.6,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR03 Cánh Tây (Trục A18)"
  },
  "HBS-928DX-GF-ARR-04": {
    "dwg": "HBS_LA_GF_00001",
    "x": 25.15,
    "y": 71.8,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR04 Cánh Tây (Trục A16)"
  },
  "HBS-928DX-GF-ARR-05": {
    "dwg": "HBS_LA_GF_00001",
    "x": 27.6,
    "y": 69.6,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR05 Cánh Tây (Trục A14)"
  },
  "HBS-928DX-GF-ARR-06": {
    "dwg": "HBS_LA_GF_00001",
    "x": 30.05,
    "y": 71.8,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR06 Cánh Tây (Trục A12)"
  },
  "HBS-928DX-GF-ARR-07": {
    "dwg": "HBS_LA_GF_00001",
    "x": 32.5,
    "y": 69.6,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR07 Cánh Tây (Trục A10)"
  },
  "HBS-928DX-GF-ARR-08": {
    "dwg": "HBS_LA_GF_00001",
    "x": 56.2,
    "y": 71.8,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR08 Cánh Đông (Trục B8)"
  },
  "HBS-928DX-GF-ARR-09": {
    "dwg": "HBS_LA_GF_00001",
    "x": 58.65,
    "y": 69.6,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR09 Cánh Đông (Trục B10)"
  },
  "HBS-928DX-GF-ARR-10": {
    "dwg": "HBS_LA_GF_00001",
    "x": 61.1,
    "y": 71.8,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR10 Cánh Đông (Trục B12)"
  },
  "HBS-928DX-GF-ARR-11": {
    "dwg": "HBS_LA_GF_00001",
    "x": 63.55,
    "y": 69.6,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR11 Cánh Đông (Trục B14)"
  },
  "HBS-928DX-GF-ARR-12": {
    "dwg": "HBS_LA_GF_00001",
    "x": 66.0,
    "y": 71.8,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR12 Cánh Đông (Trục B16)"
  },
  "HBS-928DX-GF-ARR-13": {
    "dwg": "HBS_LA_GF_00001",
    "x": 68.45,
    "y": 69.6,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR13 Cánh Đông (Trục B18)"
  },
  "HBS-928DX-GF-ARR-14": {
    "dwg": "HBS_LA_GF_00001",
    "x": 70.9,
    "y": 71.8,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR14 Cánh Đông (Trục B20)"
  },
  "HBS-928DX-GF-ARR-15": {
    "dwg": "HBS_LA_GF_00001",
    "x": 35.5,
    "y": 69.5,
    "pos_desc": "GF Tuyến Đưa Hành lý Đến Dự phòng AR15"
  },
  "HBS-928DX-GF-ARR-16": {
    "dwg": "HBS_LA_GF_00001",
    "x": 38.0,
    "y": 69.5,
    "pos_desc": "GF Tuyến Đưa Hành lý Đến Dự phòng AR16"
  },
  "HBS-928DX-GF-ARR-17": {
    "dwg": "HBS_LA_GF_00001",
    "x": 51.0,
    "y": 69.5,
    "pos_desc": "GF Tuyến Đưa Hành lý Đến Dự phòng AR17"
  },
  "HBS-928DX-GF-ARR-18": {
    "dwg": "HBS_LA_GF_00001",
    "x": 53.5,
    "y": 69.5,
    "pos_desc": "GF Tuyến Đưa Hành lý Đến Dự phòng AR18"
  },
  "HBS-928DX-GF-ARR-19": {
    "dwg": "HBS_LA_GF_00001",
    "x": 73.5,
    "y": 69.5,
    "pos_desc": "GF Tuyến Đưa Hành lý Đến Dự phòng AR19"
  },
  "HBS-ETD-GF-L3-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 43.6,
    "y": 48.8,
    "pos_desc": "GF Sàn Make-up Zone 5 (Kiểm tra Thủ công Level 4) - Bàn ETD Itemiser 5X #1"
  },
  "HBS-ETD-GF-L3-02": {
    "dwg": "HBS_LA_GF_00001",
    "x": 46.8,
    "y": 48.8,
    "pos_desc": "GF Sàn Make-up Zone 5 (Kiểm tra Thủ công Level 4) - Bàn ETD Itemiser 5X #2"
  },
  "HBS-RTT110-GF-L3-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 43.6,
    "y": 51.5,
    "pos_desc": "GF Sàn Make-up Zone 5 (Soi chiếu Thứ cấp Level 3) - Máy CT RTT110 #1 (Trục AB01-B2)"
  },
  "HBS-RTT110-GF-L3-02": {
    "dwg": "HBS_LA_GF_00001",
    "x": 46.8,
    "y": 51.5,
    "pos_desc": "GF Sàn Make-up Zone 5 (Soi chiếu Thứ cấp Level 3) - Máy CT RTT110 #2 (Trục AB01-B2)"
  },
  "HBS-928DX-GF-MUP-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 38.2,
    "y": 53.5,
    "pos_desc": "GF Tuyến Hành lý Nối chuyến Transfer (Cánh Tây TF1 (Trục A4-A5))"
  },
  "HBS-928DX-GF-MUP-02": {
    "dwg": "HBS_LA_GF_00001",
    "x": 52.4,
    "y": 53.5,
    "pos_desc": "GF Tuyến Hành lý Nối chuyến Transfer (Cánh Đông TF2 (Trục B4-B5))"
  },
  "HBS-632DV-GF-MUP-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 62.5,
    "y": 52.0,
    "pos_desc": "GF Khu vực Hành lý Quá khổ Đi OOG Make-up Cánh Đông (Trục B13-B14)"
  },
  "HBS-632DV-GF-ARR-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 15.5,
    "y": 73.2,
    "pos_desc": "GF Khu vực Hành lý Quá khổ Đến OOG Arrival Cánh Tây (Trục A22-A23)"
  },
  "SSE-920DX-1F-TRF-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 12.8,
    "y": 41.5,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Tây (Trục A24-A25, 10005) (RAP-920DX)"
  },
  "SSE-920DX-1F-TRF-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 65.5,
    "y": 47.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Đông (Trục B15-B16, 10004) (RAP-920DX)"
  },
  "SSE-ETD-1F-TRF-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 15.0,
    "y": 41.5,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Tây (Trục A24-A25, 10005) (RAP-ITEMISER5X)"
  },
  "SSE-ETD-1F-TRF-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 67.7,
    "y": 47.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Đông (Trục B15-B16, 10004) (RAP-ITEMISER5X)"
  },
  "SSE-TRS12-1F-TRF-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 14.0,
    "y": 41.5,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Tây (Trục A24-A25, 10005) (RAP-TRS-920DX)"
  },
  "SSE-TRS12-1F-TRF-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 66.7,
    "y": 47.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Đông (Trục B15-B16, 10004) (RAP-TRS-920DX)"
  },
  "SSE-WTMD-1F-TRF-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 11.6,
    "y": 41.5,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Tây (Trục A24-A25, 10005) (RAP-METOR6E)"
  },
  "SSE-WTMD-1F-TRF-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 64.3,
    "y": 47.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Đông (Trục B15-B16, 10004) (RAP-METOR6E)"
  },
  "SSE-632DV-1F-CUSE-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 53.4,
    "y": 51.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông (Quá khổ OOG, Trục B7-B8, 10002) - Máy 632DV"
  },
  "SSE-928DX-1F-CUSE-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 55.2,
    "y": 51.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông (Trục B8-B10, 10002) - Máy 928DX #1"
  },
  "SSE-928DX-1F-CUSE-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 56.6,
    "y": 51.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông (Trục B8-B10, 10002) - Máy 928DX #2"
  },
  "SSE-928DX-1F-CUSE-03": {
    "dwg": "SSE_LA_1F_00001",
    "x": 58.0,
    "y": 51.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông (Trục B8-B10, 10002) - Máy 928DX #3"
  },
  "SSE-928DX-1F-CUSE-04": {
    "dwg": "SSE_LA_1F_00001",
    "x": 59.4,
    "y": 51.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông (Trục B8-B10, 10002) - Máy 928DX #4"
  },
  "SSE-RFID-1F-CUSE-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 54.4,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #1"
  },
  "SSE-RFID-1F-CUSE-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 55.15,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #2"
  },
  "SSE-RFID-1F-CUSE-03": {
    "dwg": "SSE_LA_1F_00001",
    "x": 55.9,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #3"
  },
  "SSE-RFID-1F-CUSE-04": {
    "dwg": "SSE_LA_1F_00001",
    "x": 56.65,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #4"
  },
  "SSE-RFID-1F-CUSE-05": {
    "dwg": "SSE_LA_1F_00001",
    "x": 57.4,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #5"
  },
  "SSE-RFID-1F-CUSE-06": {
    "dwg": "SSE_LA_1F_00001",
    "x": 58.15,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #6"
  },
  "SSE-RFID-1F-CUSE-07": {
    "dwg": "SSE_LA_1F_00001",
    "x": 58.9,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #7"
  },
  "SSE-RFID-1F-CUSE-08": {
    "dwg": "SSE_LA_1F_00001",
    "x": 59.65,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #8"
  },
  "SSE-RFID-1F-CUSE-09": {
    "dwg": "SSE_LA_1F_00001",
    "x": 60.4,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #9"
  },
  "SSE-RFID-1F-CUSE-10": {
    "dwg": "SSE_LA_1F_00001",
    "x": 61.15,
    "y": 53.6,
    "pos_desc": "1F Hải quan Cánh Đông - Cổng RFID EAS-AMD06HP #10"
  },
  "SSE-928DX-1F-CUSW-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 35.2,
    "y": 48.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Tây (Trục A9-A11, 10003) - Máy 928DX #1"
  },
  "SSE-928DX-1F-CUSW-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 36.6,
    "y": 48.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Tây (Trục A9-A11, 10003) - Máy 928DX #2"
  },
  "SSE-928DX-1F-CUSW-03": {
    "dwg": "SSE_LA_1F_00001",
    "x": 38.0,
    "y": 48.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Tây (Trục A9-A11, 10003) - Máy 928DX #3"
  },
  "SSE-928DX-1F-CUSW-04": {
    "dwg": "SSE_LA_1F_00001",
    "x": 39.4,
    "y": 48.6,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Tây (Trục A9-A11, 10003) - Máy 928DX #4"
  },
  "SSE-RFID-1F-CUSW-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 34.6,
    "y": 50.8,
    "pos_desc": "1F Hải quan Cánh Tây - Cổng RFID EAS-AMD06HP #1"
  },
  "SSE-RFID-1F-CUSW-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 35.35,
    "y": 50.8,
    "pos_desc": "1F Hải quan Cánh Tây - Cổng RFID EAS-AMD06HP #2"
  },
  "SSE-RFID-1F-CUSW-03": {
    "dwg": "SSE_LA_1F_00001",
    "x": 36.1,
    "y": 50.8,
    "pos_desc": "1F Hải quan Cánh Tây - Cổng RFID EAS-AMD06HP #3"
  },
  "SSE-RFID-1F-CUSW-04": {
    "dwg": "SSE_LA_1F_00001",
    "x": 36.85,
    "y": 50.8,
    "pos_desc": "1F Hải quan Cánh Tây - Cổng RFID EAS-AMD06HP #4"
  },
  "SSE-RFID-1F-CUSW-05": {
    "dwg": "SSE_LA_1F_00001",
    "x": 37.6,
    "y": 50.8,
    "pos_desc": "1F Hải quan Cánh Tây - Cổng RFID EAS-AMD06HP #5"
  },
  "SSE-RFID-1F-CUSW-06": {
    "dwg": "SSE_LA_1F_00001",
    "x": 38.35,
    "y": 50.8,
    "pos_desc": "1F Hải quan Cánh Tây - Cổng RFID EAS-AMD06HP #6"
  },
  "SSE-CMS-SYS-01": {
    "dwg": "SSE_LA_2F_00001",
    "x": 22.2,
    "y": 62.6,
    "pos_desc": "2F Trung tâm Dữ liệu SSE CMS - Phòng Máy chủ DC1 (Trục A18, 10001)"
  },
  "SSE-CMS-SYS-02": {
    "dwg": "SSE_LA_2F_00001",
    "x": 57.6,
    "y": 65.4,
    "pos_desc": "2F Trung tâm Dữ liệu SSE CMS - Phòng Máy chủ DC2 (Trục B16, 10002)"
  },
  "SSE-CMS-SYS-03": {
    "dwg": "SSE_LA_2F_00001",
    "x": 58.8,
    "y": 65.4,
    "pos_desc": "2F Trung tâm Dữ liệu SSE CMS - Tủ Dự phòng FDR (Trục B16, 10002)"
  },
  "SSE-ETD-3F-DEP-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 17.0,
    "y": 63.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Bàn dò chất nổ ETD #1"
  },
  "SSE-ETD-3F-DEP-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 19.5,
    "y": 63.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Bàn dò chất nổ ETD #2"
  },
  "SSE-ETD-3F-DEP-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 52.0,
    "y": 55.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Bàn dò chất nổ ETD #3"
  },
  "SSE-ETD-3F-DEP-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 54.2,
    "y": 55.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Bàn dò chất nổ ETD #4"
  },
  "SSE-ETD-3F-DEP-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 61.5,
    "y": 43.8,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Bàn dò chất nổ ETD #5"
  },
  "SSE-ETD-3F-DEP-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 24.5,
    "y": 43.8,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Bàn dò chất nổ ETD #6"
  },
  "SSE-ETD-3F-DEP-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 29.2,
    "y": 55.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Bàn dò chất nổ ETD #7"
  },
  "SSE-ETD-3F-DEP-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 31.5,
    "y": 55.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Bàn dò chất nổ ETD #8"
  },
  "SSE-920CT-3F-INTE-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 50.6,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Máy CT 920CT (Làn E01)"
  },
  "SSE-920CT-3F-INTE-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.5,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Máy CT 920CT (Làn E02)"
  },
  "SSE-920CT-3F-INTE-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 52.4,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Máy CT 920CT (Làn E03)"
  },
  "SSE-920CT-3F-INTE-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 53.3,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Máy CT 920CT (Làn E04)"
  },
  "SSE-920CT-3F-INTE-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 54.2,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Máy CT 920CT (Làn E05)"
  },
  "SSE-920CT-3F-INTE-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 55.1,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Máy CT 920CT (Làn E06)"
  },
  "SSE-920CT-3F-INTE-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.0,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Máy CT 920CT (Làn E07)"
  },
  "SSE-920CT-3F-INTE-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.9,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Máy CT 920CT (Làn E08)"
  },
  "SSE-920CT-3F-INTE-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 60.8,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Máy CT 920CT (Làn E09)"
  },
  "SSE-920CT-3F-INTE-10": {
    "dwg": "SSE_LA_3F_00001",
    "x": 61.7,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Máy CT 920CT (Làn E10)"
  },
  "SSE-920CT-3F-INTE-11": {
    "dwg": "SSE_LA_3F_00001",
    "x": 62.6,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Máy CT 920CT (Làn E11)"
  },
  "SSE-920CT-3F-INTE-12": {
    "dwg": "SSE_LA_3F_00001",
    "x": 63.5,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Máy CT 920CT (Làn E12)"
  },
  "SSE-920CT-3F-INTE-13": {
    "dwg": "SSE_LA_3F_00001",
    "x": 64.4,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Máy CT 920CT (Làn E13)"
  },
  "SSE-QPS201-3F-INTE-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.2,
    "y": 58.6,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng BodyScan QPS201 E#1"
  },
  "SSE-QPS201-3F-INTE-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 52.6,
    "y": 58.6,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng BodyScan QPS201 E#2"
  },
  "SSE-QPS201-3F-INTE-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 54.0,
    "y": 58.6,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng BodyScan QPS201 E#3"
  },
  "SSE-QPS201-3F-INTE-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 55.4,
    "y": 58.6,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng BodyScan QPS201 E#4"
  },
  "SSE-QPS201-3F-INTE-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.8,
    "y": 47.1,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng BodyScan QPS201 E#5"
  },
  "SSE-QPS201-3F-INTE-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 61.2,
    "y": 47.1,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng BodyScan QPS201 E#6"
  },
  "SSE-QPS201-3F-INTE-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 62.6,
    "y": 47.1,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Cổng BodyScan QPS201 E#7"
  },
  "SSE-TRS195-3F-INTE-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 50.6,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Băng tải ATRS 19.5m (Làn E01)"
  },
  "SSE-TRS195-3F-INTE-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.5,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Băng tải ATRS 19.5m (Làn E02)"
  },
  "SSE-TRS195-3F-INTE-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 52.4,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Băng tải ATRS 19.5m (Làn E03)"
  },
  "SSE-TRS195-3F-INTE-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 53.3,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Băng tải ATRS 19.5m (Làn E04)"
  },
  "SSE-TRS195-3F-INTE-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 54.2,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Băng tải ATRS 19.5m (Làn E05)"
  },
  "SSE-TRS195-3F-INTE-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 55.1,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Băng tải ATRS 19.5m (Làn E06)"
  },
  "SSE-TRS195-3F-INTE-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.0,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Băng tải ATRS 19.5m (Làn E07)"
  },
  "SSE-TRS195-3F-INTE-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.9,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Băng tải ATRS 19.5m (Làn E08)"
  },
  "SSE-TRS195-3F-INTE-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 60.8,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Băng tải ATRS 19.5m (Làn E09)"
  },
  "SSE-TRS195-3F-INTE-10": {
    "dwg": "SSE_LA_3F_00001",
    "x": 61.7,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Băng tải ATRS 19.5m (Làn E10)"
  },
  "SSE-TRS195-3F-INTE-11": {
    "dwg": "SSE_LA_3F_00001",
    "x": 62.6,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Băng tải ATRS 19.5m (Làn E11)"
  },
  "SSE-TRS195-3F-INTE-12": {
    "dwg": "SSE_LA_3F_00001",
    "x": 63.5,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Băng tải ATRS 19.5m (Làn E12)"
  },
  "SSE-TRS195-3F-INTE-13": {
    "dwg": "SSE_LA_3F_00001",
    "x": 64.4,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Băng tải ATRS 19.5m (Làn E13)"
  },
  "SSE-WTMD-3F-INTE-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 50.95,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng từ Metor 6E (Làn E01)"
  },
  "SSE-WTMD-3F-INTE-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.85,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng từ Metor 6E (Làn E02)"
  },
  "SSE-WTMD-3F-INTE-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 52.75,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng từ Metor 6E (Làn E03)"
  },
  "SSE-WTMD-3F-INTE-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 53.65,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng từ Metor 6E (Làn E04)"
  },
  "SSE-WTMD-3F-INTE-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 54.55,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng từ Metor 6E (Làn E05)"
  },
  "SSE-WTMD-3F-INTE-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 55.45,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10003 Cụm 3 (Trục B4-B6)) - Cổng từ Metor 6E (Làn E06)"
  },
  "SSE-WTMD-3F-INTE-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.35,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Cổng từ Metor 6E (Làn E07)"
  },
  "SSE-WTMD-3F-INTE-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 60.25,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Cổng từ Metor 6E (Làn E08)"
  },
  "SSE-WTMD-3F-INTE-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 61.15,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Cổng từ Metor 6E (Làn E09)"
  },
  "SSE-WTMD-3F-INTE-10": {
    "dwg": "SSE_LA_3F_00001",
    "x": 62.05,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Cổng từ Metor 6E (Làn E10)"
  },
  "SSE-WTMD-3F-INTE-11": {
    "dwg": "SSE_LA_3F_00001",
    "x": 62.95,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Cổng từ Metor 6E (Làn E11)"
  },
  "SSE-WTMD-3F-INTE-12": {
    "dwg": "SSE_LA_3F_00001",
    "x": 63.85,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Cổng từ Metor 6E (Làn E12)"
  },
  "SSE-WTMD-3F-INTE-13": {
    "dwg": "SSE_LA_3F_00001",
    "x": 64.75,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông (10004 Cụm 4 (Trục B10-B12)) - Cổng từ Metor 6E (Làn E13)"
  },
  "SSE-920CT-3F-INTW-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 22.4,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Máy CT 920CT (Làn W01)"
  },
  "SSE-920CT-3F-INTW-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 23.3,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Máy CT 920CT (Làn W02)"
  },
  "SSE-920CT-3F-INTW-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 24.2,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Máy CT 920CT (Làn W03)"
  },
  "SSE-920CT-3F-INTW-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 25.1,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Máy CT 920CT (Làn W04)"
  },
  "SSE-920CT-3F-INTW-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 26.0,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Máy CT 920CT (Làn W05)"
  },
  "SSE-920CT-3F-INTW-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 28.0,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Máy CT 920CT (Làn W06)"
  },
  "SSE-920CT-3F-INTW-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 28.9,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Máy CT 920CT (Làn W07)"
  },
  "SSE-920CT-3F-INTW-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 29.8,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Máy CT 920CT (Làn W08)"
  },
  "SSE-920CT-3F-INTW-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 30.7,
    "y": 58.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Máy CT 920CT (Làn W09)"
  },
  "SSE-QPS201-3F-INTW-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 23.6,
    "y": 47.1,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng BodyScan QPS201 W#1"
  },
  "SSE-QPS201-3F-INTW-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 25.4,
    "y": 47.1,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng BodyScan QPS201 W#2"
  },
  "SSE-QPS201-3F-INTW-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 28.8,
    "y": 58.6,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng BodyScan QPS201 W#3"
  },
  "SSE-QPS201-3F-INTW-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 30.5,
    "y": 58.6,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng BodyScan QPS201 W#4"
  },
  "SSE-QPS201-3F-INTW-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 32.2,
    "y": 58.6,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng BodyScan QPS201 W#5"
  },
  "SSE-TRS195-3F-INTW-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 22.4,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Băng tải ATRS 19.5m (Làn W01)"
  },
  "SSE-TRS195-3F-INTW-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 23.3,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Băng tải ATRS 19.5m (Làn W02)"
  },
  "SSE-TRS195-3F-INTW-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 24.2,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Băng tải ATRS 19.5m (Làn W03)"
  },
  "SSE-TRS195-3F-INTW-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 25.1,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Băng tải ATRS 19.5m (Làn W04)"
  },
  "SSE-TRS195-3F-INTW-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 26.0,
    "y": 44.4,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Băng tải ATRS 19.5m (Làn W05)"
  },
  "SSE-TRS195-3F-INTW-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 28.0,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Băng tải ATRS 19.5m (Làn W06)"
  },
  "SSE-TRS195-3F-INTW-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 28.9,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Băng tải ATRS 19.5m (Làn W07)"
  },
  "SSE-TRS195-3F-INTW-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 29.8,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Băng tải ATRS 19.5m (Làn W08)"
  },
  "SSE-TRS195-3F-INTW-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 30.7,
    "y": 55.9,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Băng tải ATRS 19.5m (Làn W09)"
  },
  "SSE-WTMD-3F-INTW-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 22.75,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng từ Metor 6E (Làn W01)"
  },
  "SSE-WTMD-3F-INTW-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 23.65,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng từ Metor 6E (Làn W02)"
  },
  "SSE-WTMD-3F-INTW-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 24.55,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng từ Metor 6E (Làn W03)"
  },
  "SSE-WTMD-3F-INTW-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 25.45,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng từ Metor 6E (Làn W04)"
  },
  "SSE-WTMD-3F-INTW-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 26.35,
    "y": 47.7,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10001 Cụm 1 (Trục A16-A18)) - Cổng từ Metor 6E (Làn W05)"
  },
  "SSE-WTMD-3F-INTW-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 28.35,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Cổng từ Metor 6E (Làn W06)"
  },
  "SSE-WTMD-3F-INTW-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 29.25,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Cổng từ Metor 6E (Làn W07)"
  },
  "SSE-WTMD-3F-INTW-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 30.15,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Cổng từ Metor 6E (Làn W08)"
  },
  "SSE-WTMD-3F-INTW-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 31.05,
    "y": 59.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây (10002 Cụm 2 (Trục A12-A14)) - Cổng từ Metor 6E (Làn W09)"
  },
  "SSE-920DX-3F-STF-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 10.5,
    "y": 49.8,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Tây (Trục A24, 10006)) - RAP-920DX"
  },
  "SSE-920DX-3F-STF-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 13.5,
    "y": 66.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc nội Tây (Trục A22-A23, 10005)) - RAP-920DX"
  },
  "SSE-920DX-3F-STF-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 66.5,
    "y": 49.8,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Đông (Trục B18-B19)) - RAP-920DX"
  },
  "SSE-ETD-3F-STF-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 11.6,
    "y": 49.8,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Tây (Trục A24, 10006)) - RAP-ITEMISER5X"
  },
  "SSE-ETD-3F-STF-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 14.6,
    "y": 66.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc nội Tây (Trục A22-A23, 10005)) - RAP-ITEMISER5X"
  },
  "SSE-ETD-3F-STF-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 67.6,
    "y": 49.8,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Đông (Trục B18-B19)) - RAP-ITEMISER5X"
  },
  "SSE-WTMD-3F-STF-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 9.4,
    "y": 49.8,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Tây (Trục A24, 10006)) - RAP-METOR6E"
  },
  "SSE-WTMD-3F-STF-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 12.4,
    "y": 66.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc nội Tây (Trục A22-A23, 10005)) - RAP-METOR6E"
  },
  "SSE-WTMD-3F-STF-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 65.4,
    "y": 49.8,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Đông (Trục B18-B19)) - RAP-METOR6E"
  },
  "SSE-920CT-3F-DOM-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 16.2,
    "y": 66.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Máy CT 920CT (Làn D01, Trục A20-A22)"
  },
  "SSE-920CT-3F-DOM-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 17.1,
    "y": 66.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Máy CT 920CT (Làn D02, Trục A20-A22)"
  },
  "SSE-920CT-3F-DOM-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 18.0,
    "y": 66.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Máy CT 920CT (Làn D03, Trục A20-A22)"
  },
  "SSE-920CT-3F-DOM-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 18.9,
    "y": 66.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Máy CT 920CT (Làn D04, Trục A20-A22)"
  },
  "SSE-920CT-3F-DOM-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 19.8,
    "y": 66.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Máy CT 920CT (Làn D05, Trục A20-A22)"
  },
  "SSE-920CT-3F-DOM-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 20.7,
    "y": 66.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Máy CT 920CT (Làn D06, Trục A20-A22)"
  },
  "SSE-QPS201-3F-DOM-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 17.1,
    "y": 67.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng BodyScan QPS201 #1"
  },
  "SSE-QPS201-3F-DOM-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 18.5,
    "y": 67.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng BodyScan QPS201 #2"
  },
  "SSE-QPS201-3F-DOM-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 19.9,
    "y": 67.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng BodyScan QPS201 #3"
  },
  "SSE-TRS195-3F-DOM-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 16.2,
    "y": 64.6,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Băng tải ATRS 19.5m (Làn D01)"
  },
  "SSE-TRS195-3F-DOM-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 17.1,
    "y": 64.6,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Băng tải ATRS 19.5m (Làn D02)"
  },
  "SSE-TRS195-3F-DOM-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 18.0,
    "y": 64.6,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Băng tải ATRS 19.5m (Làn D03)"
  },
  "SSE-TRS195-3F-DOM-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 18.9,
    "y": 64.6,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Băng tải ATRS 19.5m (Làn D04)"
  },
  "SSE-TRS195-3F-DOM-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 19.8,
    "y": 64.6,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Băng tải ATRS 19.5m (Làn D05)"
  },
  "SSE-TRS195-3F-DOM-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 20.7,
    "y": 64.6,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Băng tải ATRS 19.5m (Làn D06)"
  },
  "SSE-WTMD-3F-DOM-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 16.55,
    "y": 67.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng từ Metor 6E (Làn D01)"
  },
  "SSE-WTMD-3F-DOM-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 17.45,
    "y": 67.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng từ Metor 6E (Làn D02)"
  },
  "SSE-WTMD-3F-DOM-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 18.35,
    "y": 67.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng từ Metor 6E (Làn D03)"
  },
  "SSE-WTMD-3F-DOM-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 19.25,
    "y": 67.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng từ Metor 6E (Làn D04)"
  },
  "SSE-WTMD-3F-DOM-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 20.15,
    "y": 67.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng từ Metor 6E (Làn D05)"
  },
  "SSE-WTMD-3F-DOM-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 21.05,
    "y": 67.8,
    "pos_desc": "3F An ninh Khởi hành Quốc nội (10005) - Cổng từ Metor 6E (Làn D06)"
  },
  "SSE-920DX-GF-STF-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 25.2,
    "y": 45.2,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Nội địa (Trục A14-A15, 10003)) - RAP-920DX"
  },
  "SSE-920DX-GF-STF-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 28.5,
    "y": 45.2,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc tế (Trục A12-A13, 10003)) - RAP-920DX"
  },
  "SSE-920DX-GF-STF-03": {
    "dwg": "SSE_LA_GF_00001",
    "x": 64.8,
    "y": 43.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế (Trục B13-B14, 10002)) - RAP-920DX"
  },
  "SSE-928DX-GF-STF-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 26.4,
    "y": 45.2,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Nội địa (Trục A14-A15, 10003)) - RAP-928DX-SSE"
  },
  "SSE-928DX-GF-STF-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 29.7,
    "y": 45.2,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc tế (Trục A12-A13, 10003)) - RAP-928DX-SSE"
  },
  "SSE-928DX-GF-STF-03": {
    "dwg": "SSE_LA_GF_00001",
    "x": 66.0,
    "y": 43.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế (Trục B13-B14, 10002)) - RAP-928DX-SSE"
  },
  "SSE-ETD-GF-STF-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 27.4,
    "y": 45.2,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Nội địa (Trục A14-A15, 10003)) - RAP-ITEMISER5X"
  },
  "SSE-ETD-GF-STF-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 27.4,
    "y": 45.8,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Nội địa (Trục A14-A15, 10003)) - RAP-ITEMISER5X"
  },
  "SSE-ETD-GF-STF-03": {
    "dwg": "SSE_LA_GF_00001",
    "x": 30.7,
    "y": 45.2,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc tế (Trục A12-A13, 10003)) - RAP-ITEMISER5X"
  },
  "SSE-ETD-GF-STF-04": {
    "dwg": "SSE_LA_GF_00001",
    "x": 67.0,
    "y": 43.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế (Trục B13-B14, 10002)) - RAP-ITEMISER5X"
  },
  "SSE-ETD-GF-STF-05": {
    "dwg": "SSE_LA_GF_00001",
    "x": 67.0,
    "y": 43.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế (Trục B13-B14, 10002)) - RAP-ITEMISER5X"
  },
  "SSE-WTMD-GF-STF-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 24.0,
    "y": 45.2,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Nội địa (Trục A14-A15, 10003)) - RAP-METOR6E"
  },
  "SSE-WTMD-GF-STF-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 27.3,
    "y": 45.2,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc tế (Trục A12-A13, 10003)) - RAP-METOR6E"
  },
  "SSE-WTMD-GF-STF-03": {
    "dwg": "SSE_LA_GF_00001",
    "x": 63.6,
    "y": 43.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế (Trục B13-B14, 10002)) - RAP-METOR6E"
  },
  "SSE-920DX-GF-VIP-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 19.8,
    "y": 64.2,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Tây (Trục A20-A21, 10001) (RAP-920DX)"
  },
  "SSE-920DX-GF-VIP-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 59.5,
    "y": 65.8,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Đông (Trục B18-B19, 10004) (RAP-920DX)"
  },
  "SSE-ETD-GF-VIP-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 22.2,
    "y": 64.2,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Tây (Trục A20-A21, 10001) (RAP-ITEMISER5X)"
  },
  "SSE-ETD-GF-VIP-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 61.9,
    "y": 65.8,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Đông (Trục B18-B19, 10004) (RAP-ITEMISER5X)"
  },
  "SSE-QPS201-GF-VIP-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 21.1,
    "y": 64.2,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Tây (Trục A20-A21, 10001) (RS-QPS201)"
  },
  "SSE-QPS201-GF-VIP-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 60.8,
    "y": 65.8,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Đông (Trục B18-B19, 10004) (RS-QPS201)"
  },
  "SSE-WTMD-GF-VIP-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 18.6,
    "y": 64.2,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Tây (Trục A20-A21, 10001) (RAP-METOR6E)"
  },
  "SSE-WTMD-GF-VIP-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 58.3,
    "y": 65.8,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Đông (Trục B18-B19, 10004) (RAP-METOR6E)"
  }
};

function resolveMachineCadInfo(machine) {
  if (!machine) return null;
  const exact = EXACT_MACHINE_COORDS[machine.machine_code];
  if (exact && DRAWINGS_CATALOG[exact.dwg]) {
    const dwgObj = DRAWINGS_CATALOG[exact.dwg];
    return {
      dwg_id: exact.dwg,
      dwg: dwgObj,
      x: exact.x,
      y: exact.y,
      pos_desc: exact.pos_desc || machine.area_name,
    };
  }
  // Fallback by system and floor
  const sys = machine.system_type || "HBS";
  const flr = machine.floor || "GF";
  const defId = `${sys}_LA_${flr}_00001`;
  const dwgObj = DRAWINGS_CATALOG[defId] || DRAWINGS_CATALOG.HBS_LA_GF_00001;
  return {
    dwg_id: dwgObj.id,
    dwg: dwgObj,
    x: 50.0,
    y: 50.0,
    pos_desc: machine.area_name || "Vị trí máy",
  };
}

function getMachinesForDrawing(dwgId, allMachines) {
  const dwg = DRAWINGS_CATALOG[dwgId];
  if (!dwg || !Array.isArray(allMachines)) return [];

  const result = [];
  allMachines.forEach((m) => {
    const info = resolveMachineCadInfo(m);
    if (!info) return;
    if (info.dwg_id === dwgId) {
      result.push({
        machine: m,
        x: info.x,
        y: info.y,
        pos_desc: info.pos_desc,
      });
    }
  });
  return result;
}

/* ==========================================================================
   LTIA Package 5.10 (HBS & SSE) - Overall Floor Plans Catalog & 234 Machine Coordinates
   Direct Layout Coordinates on 7 Approved Overall Floor Plans (00001)
   ========================================================================== */

const DRAWINGS_CATALOG = {
  HBS_LA_GF_00001: {
    id: "HBS_LA_GF_00001",
    code: "LTIA1-PTB-PMI-HBS3-LA-GF-XX-00001",
    system: "HBS",
    floor: "GF",
    kind: "OVERALL",
    zone_label: "HBS Tầng Trệt (GF)",
    title: "HBS - Mặt bằng tổng thể Tầng Trệt (GF) - 19 tuyến Arrival AR01..AR14, 2 RTT110 Make-up, 2 Transfer, 2 OOG 632DV, 2 ETD (27 máy)",
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
    "x": 52.0,
    "y": 52.4,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E1 (Trục 24-25)"
  },
  "HBS-RTT110-2F-E-02": {
    "dwg": "HBS_LA_2F_00001",
    "x": 54.1,
    "y": 53.3,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E2 (Trục 25-26)"
  },
  "HBS-RTT110-2F-E-03": {
    "dwg": "HBS_LA_2F_00001",
    "x": 56.2,
    "y": 54.2,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E3 (Trục 26-27)"
  },
  "HBS-RTT110-2F-E-04": {
    "dwg": "HBS_LA_2F_00001",
    "x": 58.3,
    "y": 55.1,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E4 (Trục 27-28)"
  },
  "HBS-RTT110-2F-E-05": {
    "dwg": "HBS_LA_2F_00001",
    "x": 60.4,
    "y": 56.0,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Đông - Tuyến E5 (Trục 28-29)"
  },
  "HBS-RTT110-2F-W-01": {
    "dwg": "HBS_LA_2F_00001",
    "x": 32.0,
    "y": 56.0,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W1 (Trục 12-13)"
  },
  "HBS-RTT110-2F-W-02": {
    "dwg": "HBS_LA_2F_00001",
    "x": 34.1,
    "y": 55.1,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W2 (Trục 13-14)"
  },
  "HBS-RTT110-2F-W-03": {
    "dwg": "HBS_LA_2F_00001",
    "x": 36.2,
    "y": 54.2,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W3 (Trục 14-15)"
  },
  "HBS-RTT110-2F-W-04": {
    "dwg": "HBS_LA_2F_00001",
    "x": 38.3,
    "y": 53.3,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W4 (Trục 15-16)"
  },
  "HBS-RTT110-2F-W-05": {
    "dwg": "HBS_LA_2F_00001",
    "x": 40.4,
    "y": 52.4,
    "pos_desc": "2F Soi chiếu Sơ cấp Cánh Tây - Tuyến W5 (Trục 16-17)"
  },
  "HBS-CMS-MATRIX30-01": {
    "dwg": "HBS_LA_2F_00001",
    "x": 45.5,
    "y": 57.5,
    "pos_desc": "2F Phòng Máy chủ Trung tâm - Tủ Matrix 30 Rack #1"
  },
  "HBS-CMS-MATRIX30-02": {
    "dwg": "HBS_LA_2F_00001",
    "x": 47.0,
    "y": 57.5,
    "pos_desc": "2F Phòng Máy chủ Trung tâm - Tủ Matrix 30 Rack #2"
  },
  "HBS-CMS-MATRIX30-03": {
    "dwg": "HBS_LA_2F_00001",
    "x": 48.5,
    "y": 57.5,
    "pos_desc": "2F Phòng Máy chủ Trung tâm - Tủ Matrix 30 Rack #3"
  },
  "HBS-ETD-3F-OOG-01": {
    "dwg": "HBS_LA_3F_00001",
    "x": 25.5,
    "y": 52.5,
    "pos_desc": "3F Quầy Hành lý Quá khổ OOG Cánh Tây (Máy 928DX)"
  },
  "HBS-ETD-3F-OOG-02": {
    "dwg": "HBS_LA_3F_00001",
    "x": 66.5,
    "y": 52.5,
    "pos_desc": "3F Quầy Hành lý Quá khổ OOG Cánh Đông (Máy 928DX)"
  },
  "HBS-928DX-3F-OOG-01": {
    "dwg": "HBS_LA_3F_00001",
    "x": 25.5,
    "y": 52.5,
    "pos_desc": "3F Quầy Hành lý Quá khổ OOG Cánh Tây (Máy 928DX)"
  },
  "HBS-928DX-3F-OOG-02": {
    "dwg": "HBS_LA_3F_00001",
    "x": 66.5,
    "y": 52.5,
    "pos_desc": "3F Quầy Hành lý Quá khổ OOG Cánh Đông (Máy 928DX)"
  },
  "HBS-928DX-3F-INT-01": {
    "dwg": "HBS_LA_3F_00001",
    "x": 34.2,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo B - Máy #1)"
  },
  "HBS-928DX-3F-INT-02": {
    "dwg": "HBS_LA_3F_00001",
    "x": 35.9,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo B - Máy #2)"
  },
  "HBS-928DX-3F-INT-03": {
    "dwg": "HBS_LA_3F_00001",
    "x": 38.8,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo C - Máy #3)"
  },
  "HBS-928DX-3F-INT-04": {
    "dwg": "HBS_LA_3F_00001",
    "x": 40.5,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo C - Máy #4)"
  },
  "HBS-928DX-3F-INT-05": {
    "dwg": "HBS_LA_3F_00001",
    "x": 43.4,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo D - Máy #5)"
  },
  "HBS-928DX-3F-INT-06": {
    "dwg": "HBS_LA_3F_00001",
    "x": 45.1,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo D - Máy #6)"
  },
  "HBS-928DX-3F-INT-07": {
    "dwg": "HBS_LA_3F_00001",
    "x": 48.0,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo E - Máy #7)"
  },
  "HBS-928DX-3F-INT-08": {
    "dwg": "HBS_LA_3F_00001",
    "x": 49.7,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo E - Máy #8)"
  },
  "HBS-928DX-3F-INT-09": {
    "dwg": "HBS_LA_3F_00001",
    "x": 52.6,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo F - Máy #9)"
  },
  "HBS-928DX-3F-INT-10": {
    "dwg": "HBS_LA_3F_00001",
    "x": 54.3,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo F - Máy #10)"
  },
  "HBS-928DX-3F-INT-11": {
    "dwg": "HBS_LA_3F_00001",
    "x": 57.2,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo G - Máy #11)"
  },
  "HBS-928DX-3F-INT-12": {
    "dwg": "HBS_LA_3F_00001",
    "x": 58.9,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo G - Máy #12)"
  },
  "HBS-928DX-3F-INT-13": {
    "dwg": "HBS_LA_3F_00001",
    "x": 61.8,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo H - Máy #13)"
  },
  "HBS-928DX-3F-INT-14": {
    "dwg": "HBS_LA_3F_00001",
    "x": 63.5,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc tế (Đảo H - Máy #14)"
  },
  "HBS-928DX-3F-DOM-01": {
    "dwg": "HBS_LA_3F_00001",
    "x": 29.8,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc nội (Đảo A - Máy #1)"
  },
  "HBS-928DX-3F-DOM-02": {
    "dwg": "HBS_LA_3F_00001",
    "x": 31.6,
    "y": 54.0,
    "pos_desc": "3F Đảo Check-in Quốc nội (Đảo A - Máy #2)"
  },
  "HBS-928DX-GF-ARR-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 23.5,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR01 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-02": {
    "dwg": "HBS_LA_GF_00001",
    "x": 25.6,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR02 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-03": {
    "dwg": "HBS_LA_GF_00001",
    "x": 27.7,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR03 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-04": {
    "dwg": "HBS_LA_GF_00001",
    "x": 29.8,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR04 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-05": {
    "dwg": "HBS_LA_GF_00001",
    "x": 31.9,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR05 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-06": {
    "dwg": "HBS_LA_GF_00001",
    "x": 34.0,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR06 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-07": {
    "dwg": "HBS_LA_GF_00001",
    "x": 36.1,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR07 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-08": {
    "dwg": "HBS_LA_GF_00001",
    "x": 38.2,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR08 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-09": {
    "dwg": "HBS_LA_GF_00001",
    "x": 40.3,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR09 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-10": {
    "dwg": "HBS_LA_GF_00001",
    "x": 47.5,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR10 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-11": {
    "dwg": "HBS_LA_GF_00001",
    "x": 49.6,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR11 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-12": {
    "dwg": "HBS_LA_GF_00001",
    "x": 51.7,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR12 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-13": {
    "dwg": "HBS_LA_GF_00001",
    "x": 53.8,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR13 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-14": {
    "dwg": "HBS_LA_GF_00001",
    "x": 55.9,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR14 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-15": {
    "dwg": "HBS_LA_GF_00001",
    "x": 58.0,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR15 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-16": {
    "dwg": "HBS_LA_GF_00001",
    "x": 60.1,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR16 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-17": {
    "dwg": "HBS_LA_GF_00001",
    "x": 62.2,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR17 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-18": {
    "dwg": "HBS_LA_GF_00001",
    "x": 64.3,
    "y": 60.5,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR18 (Máy 928DX)"
  },
  "HBS-928DX-GF-ARR-19": {
    "dwg": "HBS_LA_GF_00001",
    "x": 66.4,
    "y": 63.0,
    "pos_desc": "GF Băng chuyền Hành lý Đến - Tuyến AR19 (Máy 928DX)"
  },
  "HBS-ETD-GF-L3-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 43.2,
    "y": 46.5,
    "pos_desc": "GF Khu vực Kiểm tra Thủ công Make-up Level 4 (Bàn ETD #1)"
  },
  "HBS-ETD-GF-L3-02": {
    "dwg": "HBS_LA_GF_00001",
    "x": 47.0,
    "y": 46.5,
    "pos_desc": "GF Khu vực Kiểm tra Thủ công Make-up Level 4 (Bàn ETD #2)"
  },
  "HBS-RTT110-GF-L3-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 43.5,
    "y": 49.5,
    "pos_desc": "GF Khu vực Soi chiếu Thứ cấp Make-up Level 3 (Máy CT RTT110 #1)"
  },
  "HBS-RTT110-GF-L3-02": {
    "dwg": "HBS_LA_GF_00001",
    "x": 46.7,
    "y": 49.5,
    "pos_desc": "GF Khu vực Soi chiếu Thứ cấp Make-up Level 3 (Máy CT RTT110 #2)"
  },
  "HBS-928DX-GF-MUP-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 36.5,
    "y": 51.5,
    "pos_desc": "GF Tuyến Hành lý Nối chuyến Transfer (Cánh Tây TF1)"
  },
  "HBS-928DX-GF-MUP-02": {
    "dwg": "HBS_LA_GF_00001",
    "x": 54.5,
    "y": 51.5,
    "pos_desc": "GF Tuyến Hành lý Nối chuyến Transfer (Cánh Đông TF2)"
  },
  "HBS-632DV-GF-MUP-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 65.5,
    "y": 51.5,
    "pos_desc": "GF Khu vực Hành lý Quá khổ Đi OOG Make-up (Máy 632DV Cánh Đông)"
  },
  "HBS-632DV-GF-ARR-01": {
    "dwg": "HBS_LA_GF_00001",
    "x": 24.5,
    "y": 65.0,
    "pos_desc": "GF Khu vực Hành lý Quá khổ Đến OOG Arrival (Máy 632DV Cánh Tây)"
  },
  "SSE-920DX-1F-TRF-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 37.0,
    "y": 44.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Tây (RAP-920DX)"
  },
  "SSE-920DX-1F-TRF-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 54.0,
    "y": 44.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Đông (RAP-920DX)"
  },
  "SSE-ETD-1F-TRF-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 39.2,
    "y": 44.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Tây (RAP-ITEMISER5X)"
  },
  "SSE-ETD-1F-TRF-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 56.2,
    "y": 44.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Đông (RAP-ITEMISER5X)"
  },
  "SSE-TRS12-1F-TRF-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 38.2,
    "y": 44.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Tây (RAP-TRS-920DX)"
  },
  "SSE-TRS12-1F-TRF-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 55.2,
    "y": 44.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Đông (RAP-TRS-920DX)"
  },
  "SSE-WTMD-1F-TRF-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 35.8,
    "y": 44.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Tây (RAP-METOR6E)"
  },
  "SSE-WTMD-1F-TRF-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 52.8,
    "y": 44.0,
    "pos_desc": "1F Điểm KT An ninh Trung chuyển Transfer Cánh Đông (RAP-METOR6E)"
  },
  "SSE-632DV-1F-CUSE-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 49.5,
    "y": 55.5,
    "pos_desc": "1F Hải quan Đến Cánh Đông (Quá khổ OOG) - Máy 632DV"
  },
  "SSE-928DX-1F-CUSE-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 52.5,
    "y": 55.5,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông - Máy X-Ray 928DX #1"
  },
  "SSE-928DX-1F-CUSE-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 54.7,
    "y": 55.5,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông - Máy X-Ray 928DX #2"
  },
  "SSE-928DX-1F-CUSE-03": {
    "dwg": "SSE_LA_1F_00001",
    "x": 56.9,
    "y": 55.5,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông - Máy X-Ray 928DX #3"
  },
  "SSE-928DX-1F-CUSE-04": {
    "dwg": "SSE_LA_1F_00001",
    "x": 59.1,
    "y": 55.5,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Đông - Máy X-Ray 928DX #4"
  },
  "SSE-RFID-1F-CUSE-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 50.0,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #1"
  },
  "SSE-RFID-1F-CUSE-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 51.2,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #2"
  },
  "SSE-RFID-1F-CUSE-03": {
    "dwg": "SSE_LA_1F_00001",
    "x": 52.4,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #3"
  },
  "SSE-RFID-1F-CUSE-04": {
    "dwg": "SSE_LA_1F_00001",
    "x": 53.6,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #4"
  },
  "SSE-RFID-1F-CUSE-05": {
    "dwg": "SSE_LA_1F_00001",
    "x": 54.8,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #5"
  },
  "SSE-RFID-1F-CUSE-06": {
    "dwg": "SSE_LA_1F_00001",
    "x": 56.0,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #6"
  },
  "SSE-RFID-1F-CUSE-07": {
    "dwg": "SSE_LA_1F_00001",
    "x": 57.2,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #7"
  },
  "SSE-RFID-1F-CUSE-08": {
    "dwg": "SSE_LA_1F_00001",
    "x": 58.4,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #8"
  },
  "SSE-RFID-1F-CUSE-09": {
    "dwg": "SSE_LA_1F_00001",
    "x": 59.6,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #9"
  },
  "SSE-RFID-1F-CUSE-10": {
    "dwg": "SSE_LA_1F_00001",
    "x": 60.8,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Đông - Cổng RFID EAS-AMD06HP #10"
  },
  "SSE-928DX-1F-CUSW-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 32.5,
    "y": 55.5,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Tây - Máy X-Ray 928DX #1"
  },
  "SSE-928DX-1F-CUSW-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 34.7,
    "y": 55.5,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Tây - Máy X-Ray 928DX #2"
  },
  "SSE-928DX-1F-CUSW-03": {
    "dwg": "SSE_LA_1F_00001",
    "x": 36.9,
    "y": 55.5,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Tây - Máy X-Ray 928DX #3"
  },
  "SSE-928DX-1F-CUSW-04": {
    "dwg": "SSE_LA_1F_00001",
    "x": 39.1,
    "y": 55.5,
    "pos_desc": "1F Hải quan Hành lý Đến Cánh Tây - Máy X-Ray 928DX #4"
  },
  "SSE-RFID-1F-CUSW-01": {
    "dwg": "SSE_LA_1F_00001",
    "x": 32.0,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Tây - Cổng RFID EAS-AMD06HP #1"
  },
  "SSE-RFID-1F-CUSW-02": {
    "dwg": "SSE_LA_1F_00001",
    "x": 33.5,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Tây - Cổng RFID EAS-AMD06HP #2"
  },
  "SSE-RFID-1F-CUSW-03": {
    "dwg": "SSE_LA_1F_00001",
    "x": 35.0,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Tây - Cổng RFID EAS-AMD06HP #3"
  },
  "SSE-RFID-1F-CUSW-04": {
    "dwg": "SSE_LA_1F_00001",
    "x": 36.5,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Tây - Cổng RFID EAS-AMD06HP #4"
  },
  "SSE-RFID-1F-CUSW-05": {
    "dwg": "SSE_LA_1F_00001",
    "x": 38.0,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Tây - Cổng RFID EAS-AMD06HP #5"
  },
  "SSE-RFID-1F-CUSW-06": {
    "dwg": "SSE_LA_1F_00001",
    "x": 39.5,
    "y": 53.0,
    "pos_desc": "1F Hải quan Đến Cánh Tây - Cổng RFID EAS-AMD06HP #6"
  },
  "SSE-CMS-SYS-01": {
    "dwg": "SSE_LA_2F_00001",
    "x": 47.5,
    "y": 54.5,
    "pos_desc": "2F Trung tâm Dữ liệu SSE CMS (Data Center DC1/DC2 - Tủ #1)"
  },
  "SSE-CMS-SYS-02": {
    "dwg": "SSE_LA_2F_00001",
    "x": 49.3,
    "y": 54.5,
    "pos_desc": "2F Trung tâm Dữ liệu SSE CMS (Data Center DC1/DC2 - Tủ #2)"
  },
  "SSE-CMS-SYS-03": {
    "dwg": "SSE_LA_2F_00001",
    "x": 51.1,
    "y": 54.5,
    "pos_desc": "2F Trung tâm Dữ liệu SSE CMS (Data Center DC1/DC2 - Tủ #3)"
  },
  "SSE-ETD-3F-DEP-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 31.5,
    "y": 43.0,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Bàn dò chất nổ ETD Itemiser 5X #1"
  },
  "SSE-ETD-3F-DEP-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 34.0,
    "y": 43.0,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Bàn dò chất nổ ETD Itemiser 5X #2"
  },
  "SSE-ETD-3F-DEP-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.0,
    "y": 43.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Bàn dò chất nổ ETD Itemiser 5X #3"
  },
  "SSE-ETD-3F-DEP-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 53.8,
    "y": 43.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Bàn dò chất nổ ETD Itemiser 5X #4"
  },
  "SSE-ETD-3F-DEP-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 56.6,
    "y": 43.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Bàn dò chất nổ ETD Itemiser 5X #5"
  },
  "SSE-ETD-3F-DEP-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.4,
    "y": 43.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Bàn dò chất nổ ETD Itemiser 5X #6"
  },
  "SSE-ETD-3F-DEP-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 39.5,
    "y": 43.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Bàn dò chất nổ ETD Itemiser 5X #7"
  },
  "SSE-ETD-3F-DEP-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 43.0,
    "y": 43.0,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Bàn dò chất nổ ETD Itemiser 5X #8"
  },
  "SSE-920CT-3F-INTE-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 49.2,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E01)"
  },
  "SSE-920CT-3F-INTE-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 50.18,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E02)"
  },
  "SSE-920CT-3F-INTE-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.16,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E03)"
  },
  "SSE-920CT-3F-INTE-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 52.14,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E04)"
  },
  "SSE-920CT-3F-INTE-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 53.12,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E05)"
  },
  "SSE-920CT-3F-INTE-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 54.1,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E06)"
  },
  "SSE-920CT-3F-INTE-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 55.08,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E07)"
  },
  "SSE-920CT-3F-INTE-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 56.06,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E08)"
  },
  "SSE-920CT-3F-INTE-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 57.04,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E09)"
  },
  "SSE-920CT-3F-INTE-10": {
    "dwg": "SSE_LA_3F_00001",
    "x": 58.02,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E10)"
  },
  "SSE-920CT-3F-INTE-11": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.0,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E11)"
  },
  "SSE-920CT-3F-INTE-12": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.98,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E12)"
  },
  "SSE-920CT-3F-INTE-13": {
    "dwg": "SSE_LA_3F_00001",
    "x": 60.96,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Máy CT 920CT (Làn E13)"
  },
  "SSE-QPS201-3F-INTE-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 49.8,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng BodyScan QPS201 E#1"
  },
  "SSE-QPS201-3F-INTE-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.6,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng BodyScan QPS201 E#2"
  },
  "SSE-QPS201-3F-INTE-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 53.4,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng BodyScan QPS201 E#3"
  },
  "SSE-QPS201-3F-INTE-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 55.2,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng BodyScan QPS201 E#4"
  },
  "SSE-QPS201-3F-INTE-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 57.0,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng BodyScan QPS201 E#5"
  },
  "SSE-QPS201-3F-INTE-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 58.8,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng BodyScan QPS201 E#6"
  },
  "SSE-QPS201-3F-INTE-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 60.6,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng BodyScan QPS201 E#7"
  },
  "SSE-TRS195-3F-INTE-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 49.2,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E01)"
  },
  "SSE-TRS195-3F-INTE-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 50.18,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E02)"
  },
  "SSE-TRS195-3F-INTE-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.16,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E03)"
  },
  "SSE-TRS195-3F-INTE-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 52.14,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E04)"
  },
  "SSE-TRS195-3F-INTE-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 53.12,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E05)"
  },
  "SSE-TRS195-3F-INTE-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 54.1,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E06)"
  },
  "SSE-TRS195-3F-INTE-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 55.08,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E07)"
  },
  "SSE-TRS195-3F-INTE-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 56.06,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E08)"
  },
  "SSE-TRS195-3F-INTE-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 57.04,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E09)"
  },
  "SSE-TRS195-3F-INTE-10": {
    "dwg": "SSE_LA_3F_00001",
    "x": 58.02,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E10)"
  },
  "SSE-TRS195-3F-INTE-11": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.0,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E11)"
  },
  "SSE-TRS195-3F-INTE-12": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.98,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E12)"
  },
  "SSE-TRS195-3F-INTE-13": {
    "dwg": "SSE_LA_3F_00001",
    "x": 60.96,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Băng tải ATRS 19.5m (Làn E13)"
  },
  "SSE-WTMD-3F-INTE-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 49.55,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E01)"
  },
  "SSE-WTMD-3F-INTE-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 50.53,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E02)"
  },
  "SSE-WTMD-3F-INTE-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 51.51,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E03)"
  },
  "SSE-WTMD-3F-INTE-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 52.49,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E04)"
  },
  "SSE-WTMD-3F-INTE-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 53.47,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E05)"
  },
  "SSE-WTMD-3F-INTE-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 54.45,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E06)"
  },
  "SSE-WTMD-3F-INTE-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 55.43,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E07)"
  },
  "SSE-WTMD-3F-INTE-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 56.41,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E08)"
  },
  "SSE-WTMD-3F-INTE-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 57.39,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E09)"
  },
  "SSE-WTMD-3F-INTE-10": {
    "dwg": "SSE_LA_3F_00001",
    "x": 58.37,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E10)"
  },
  "SSE-WTMD-3F-INTE-11": {
    "dwg": "SSE_LA_3F_00001",
    "x": 59.35,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E11)"
  },
  "SSE-WTMD-3F-INTE-12": {
    "dwg": "SSE_LA_3F_00001",
    "x": 60.33,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E12)"
  },
  "SSE-WTMD-3F-INTE-13": {
    "dwg": "SSE_LA_3F_00001",
    "x": 61.31,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Đông - Cổng từ Metor 6E (Làn E13)"
  },
  "SSE-920CT-3F-INTW-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 37.5,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W01)"
  },
  "SSE-920CT-3F-INTW-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 38.45,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W02)"
  },
  "SSE-920CT-3F-INTW-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 39.4,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W03)"
  },
  "SSE-920CT-3F-INTW-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 40.35,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W04)"
  },
  "SSE-920CT-3F-INTW-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 41.3,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W05)"
  },
  "SSE-920CT-3F-INTW-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 42.25,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W06)"
  },
  "SSE-920CT-3F-INTW-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 43.2,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W07)"
  },
  "SSE-920CT-3F-INTW-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 44.15,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W08)"
  },
  "SSE-920CT-3F-INTW-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 45.1,
    "y": 46.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Máy CT 920CT (Làn W09)"
  },
  "SSE-QPS201-3F-INTW-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 38.0,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng BodyScan QPS201 W#1"
  },
  "SSE-QPS201-3F-INTW-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 39.7,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng BodyScan QPS201 W#2"
  },
  "SSE-QPS201-3F-INTW-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 41.4,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng BodyScan QPS201 W#3"
  },
  "SSE-QPS201-3F-INTW-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 43.1,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng BodyScan QPS201 W#4"
  },
  "SSE-QPS201-3F-INTW-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 44.8,
    "y": 47.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng BodyScan QPS201 W#5"
  },
  "SSE-TRS195-3F-INTW-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 37.5,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W01)"
  },
  "SSE-TRS195-3F-INTW-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 38.45,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W02)"
  },
  "SSE-TRS195-3F-INTW-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 39.4,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W03)"
  },
  "SSE-TRS195-3F-INTW-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 40.35,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W04)"
  },
  "SSE-TRS195-3F-INTW-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 41.3,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W05)"
  },
  "SSE-TRS195-3F-INTW-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 42.25,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W06)"
  },
  "SSE-TRS195-3F-INTW-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 43.2,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W07)"
  },
  "SSE-TRS195-3F-INTW-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 44.15,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W08)"
  },
  "SSE-TRS195-3F-INTW-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 45.1,
    "y": 44.5,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Băng tải ATRS 19.5m (Làn W09)"
  },
  "SSE-WTMD-3F-INTW-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 37.85,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W01)"
  },
  "SSE-WTMD-3F-INTW-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 38.8,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W02)"
  },
  "SSE-WTMD-3F-INTW-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 39.75,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W03)"
  },
  "SSE-WTMD-3F-INTW-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 40.7,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W04)"
  },
  "SSE-WTMD-3F-INTW-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 41.65,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W05)"
  },
  "SSE-WTMD-3F-INTW-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 42.6,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W06)"
  },
  "SSE-WTMD-3F-INTW-07": {
    "dwg": "SSE_LA_3F_00001",
    "x": 43.55,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W07)"
  },
  "SSE-WTMD-3F-INTW-08": {
    "dwg": "SSE_LA_3F_00001",
    "x": 44.5,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W08)"
  },
  "SSE-WTMD-3F-INTW-09": {
    "dwg": "SSE_LA_3F_00001",
    "x": 45.45,
    "y": 48.2,
    "pos_desc": "3F Khởi hành Quốc tế Cánh Tây - Cổng từ Metor 6E (Làn W09)"
  },
  "SSE-920DX-3F-STF-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 35.0,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Tây) - RAP-920DX"
  },
  "SSE-920DX-3F-STF-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 27.5,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc nội Tây) - RAP-920DX"
  },
  "SSE-920DX-3F-STF-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 64.5,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Đông) - RAP-920DX"
  },
  "SSE-ETD-3F-STF-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 36.2,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Tây) - RAP-ITEMISER5X"
  },
  "SSE-ETD-3F-STF-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 28.7,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc nội Tây) - RAP-ITEMISER5X"
  },
  "SSE-ETD-3F-STF-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 65.7,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Đông) - RAP-ITEMISER5X"
  },
  "SSE-WTMD-3F-STF-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 33.8,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Tây) - RAP-METOR6E"
  },
  "SSE-WTMD-3F-STF-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 26.3,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc nội Tây) - RAP-METOR6E"
  },
  "SSE-WTMD-3F-STF-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 63.3,
    "y": 51.5,
    "pos_desc": "3F Điểm KT An ninh Nhân viên (Quốc tế Đông) - RAP-METOR6E"
  },
  "SSE-920CT-3F-DOM-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 30.8,
    "y": 46.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Máy CT 920CT (Làn 1)"
  },
  "SSE-920CT-3F-DOM-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 31.7,
    "y": 46.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Máy CT 920CT (Làn 2)"
  },
  "SSE-920CT-3F-DOM-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 32.6,
    "y": 46.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Máy CT 920CT (Làn 3)"
  },
  "SSE-920CT-3F-DOM-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 33.5,
    "y": 46.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Máy CT 920CT (Làn 4)"
  },
  "SSE-920CT-3F-DOM-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 34.4,
    "y": 46.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Máy CT 920CT (Làn 5)"
  },
  "SSE-920CT-3F-DOM-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 35.3,
    "y": 46.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Máy CT 920CT (Làn 6)"
  },
  "SSE-QPS201-3F-DOM-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 31.2,
    "y": 47.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng BodyScan QPS201 #1"
  },
  "SSE-QPS201-3F-DOM-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 33.0,
    "y": 47.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng BodyScan QPS201 #2"
  },
  "SSE-QPS201-3F-DOM-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 34.8,
    "y": 47.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng BodyScan QPS201 #3"
  },
  "SSE-TRS195-3F-DOM-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 30.8,
    "y": 44.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Băng tải ATRS 19.5m (Làn 1)"
  },
  "SSE-TRS195-3F-DOM-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 31.7,
    "y": 44.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Băng tải ATRS 19.5m (Làn 2)"
  },
  "SSE-TRS195-3F-DOM-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 32.6,
    "y": 44.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Băng tải ATRS 19.5m (Làn 3)"
  },
  "SSE-TRS195-3F-DOM-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 33.5,
    "y": 44.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Băng tải ATRS 19.5m (Làn 4)"
  },
  "SSE-TRS195-3F-DOM-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 34.4,
    "y": 44.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Băng tải ATRS 19.5m (Làn 5)"
  },
  "SSE-TRS195-3F-DOM-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 35.3,
    "y": 44.5,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Băng tải ATRS 19.5m (Làn 6)"
  },
  "SSE-WTMD-3F-DOM-01": {
    "dwg": "SSE_LA_3F_00001",
    "x": 31.15,
    "y": 48.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng từ Metor 6E (Làn 1)"
  },
  "SSE-WTMD-3F-DOM-02": {
    "dwg": "SSE_LA_3F_00001",
    "x": 32.05,
    "y": 48.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng từ Metor 6E (Làn 2)"
  },
  "SSE-WTMD-3F-DOM-03": {
    "dwg": "SSE_LA_3F_00001",
    "x": 32.95,
    "y": 48.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng từ Metor 6E (Làn 3)"
  },
  "SSE-WTMD-3F-DOM-04": {
    "dwg": "SSE_LA_3F_00001",
    "x": 33.85,
    "y": 48.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng từ Metor 6E (Làn 4)"
  },
  "SSE-WTMD-3F-DOM-05": {
    "dwg": "SSE_LA_3F_00001",
    "x": 34.75,
    "y": 48.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng từ Metor 6E (Làn 5)"
  },
  "SSE-WTMD-3F-DOM-06": {
    "dwg": "SSE_LA_3F_00001",
    "x": 35.65,
    "y": 48.2,
    "pos_desc": "3F An ninh Khởi hành Quốc nội - Cổng từ Metor 6E (Làn 6)"
  },
  "SSE-920DX-GF-STF-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 27.5,
    "y": 61.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc nội) - RAP-920DX"
  },
  "SSE-920DX-GF-STF-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 33.0,
    "y": 60.8,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc tế) - RAP-920DX"
  },
  "SSE-920DX-GF-STF-03": {
    "dwg": "SSE_LA_GF_00001",
    "x": 62.5,
    "y": 60.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế) - RAP-920DX"
  },
  "SSE-928DX-GF-STF-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 28.7,
    "y": 61.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc nội) - RAP-928DX-SSE"
  },
  "SSE-928DX-GF-STF-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 34.2,
    "y": 60.8,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc tế) - RAP-928DX-SSE"
  },
  "SSE-928DX-GF-STF-03": {
    "dwg": "SSE_LA_GF_00001",
    "x": 63.7,
    "y": 60.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế) - RAP-928DX-SSE"
  },
  "SSE-ETD-GF-STF-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 29.7,
    "y": 61.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc nội) - RAP-ITEMISER5X"
  },
  "SSE-ETD-GF-STF-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 29.7,
    "y": 61.8,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc nội) - RAP-ITEMISER5X"
  },
  "SSE-ETD-GF-STF-03": {
    "dwg": "SSE_LA_GF_00001",
    "x": 35.2,
    "y": 60.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc tế) - RAP-ITEMISER5X"
  },
  "SSE-ETD-GF-STF-04": {
    "dwg": "SSE_LA_GF_00001",
    "x": 64.7,
    "y": 60.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế) - RAP-ITEMISER5X"
  },
  "SSE-ETD-GF-STF-05": {
    "dwg": "SSE_LA_GF_00001",
    "x": 64.7,
    "y": 60.8,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế) - RAP-ITEMISER5X"
  },
  "SSE-WTMD-GF-STF-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 26.3,
    "y": 61.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc nội) - RAP-METOR6E"
  },
  "SSE-WTMD-GF-STF-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 31.8,
    "y": 60.8,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Tây Quốc tế) - RAP-METOR6E"
  },
  "SSE-WTMD-GF-STF-03": {
    "dwg": "SSE_LA_GF_00001",
    "x": 61.3,
    "y": 60.0,
    "pos_desc": "GF Điểm KT Nhân viên & Hàng hóa (Đông Quốc tế) - RAP-METOR6E"
  },
  "SSE-920DX-GF-VIP-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 23.5,
    "y": 57.0,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Tây (RAP-920DX)"
  },
  "SSE-920DX-GF-VIP-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 67.5,
    "y": 57.0,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Đông (RAP-920DX)"
  },
  "SSE-ETD-GF-VIP-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 25.7,
    "y": 57.0,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Tây (RAP-ITEMISER5X)"
  },
  "SSE-ETD-GF-VIP-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 69.7,
    "y": 57.0,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Đông (RAP-ITEMISER5X)"
  },
  "SSE-QPS201-GF-VIP-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 24.7,
    "y": 57.0,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Tây (RS-QPS201)"
  },
  "SSE-QPS201-GF-VIP-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 68.7,
    "y": 57.0,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Đông (RS-QPS201)"
  },
  "SSE-WTMD-GF-VIP-01": {
    "dwg": "SSE_LA_GF_00001",
    "x": 22.3,
    "y": 57.0,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Tây (RAP-METOR6E)"
  },
  "SSE-WTMD-GF-VIP-02": {
    "dwg": "SSE_LA_GF_00001",
    "x": 66.3,
    "y": 57.0,
    "pos_desc": "GF Điểm Kiểm tra An ninh VIP Cánh Đông (RAP-METOR6E)"
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

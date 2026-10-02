// Extra visitor translations for text that components write in English only.
// Used by autoTranslate.ts through the visitor dictionaries in visitorStrings.ts.
//
// ROWS: one line per sentence: [English, Chinese, Malay, Tamil]. The English must match the
// text on the page exactly. Entries in visitorStrings.ts win when both files have the same text.
// PATTERNS (below): text with a changing part, such as a number or a place name.
import type { ChatLanguage } from '../../types/help';

type Dictionary = Readonly<Record<string, string>>;
type Row = readonly [en: string, zh: string, ms: string, ta: string];

const ROWS: readonly Row[] = [
  // ---------- header, profile, account ----------
  ["Demo Visitor", "演示访客", "Pelawat Demo", "டெமோ பார்வையாளர்"],
  ["Exit", "退出", "Keluar", "வெளியேறு"],
  ["Log out", "登出", "Log keluar", "வெளியேறு"],
  ["Edit name", "修改名字", "Edit nama", "பெயரைத் திருத்து"],
  ["Your name", "你的名字", "Nama anda", "உங்கள் பெயர்"],
  ["Save", "保存", "Simpan", "சேமி"],
  ["Cancel", "取消", "Batal", "ரத்து செய்"],
  ["Please enter a name.", "请输入名字。", "Sila masukkan nama.", "பெயரை உள்ளிடவும்."],
  ["We could not save your name in this browser. Please try again.", "无法在此浏览器中保存你的名字。请再试一次。", "Kami tidak dapat menyimpan nama anda dalam pelayar ini. Sila cuba lagi.", "இந்த உலாவியில் உங்கள் பெயரைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்."],
  ["Follow the clues, scan QR codes around the museum and collect toy stamps.", "跟着线索，在博物馆内扫描二维码，收集玩具印章。", "Ikut petunjuk, imbas kod QR di sekitar muzium dan kumpul cop mainan.", "குறிப்புகளைப் பின்பற்றி, அருங்காட்சியகத்தில் உள்ள QR குறியீடுகளை ஸ்கேன் செய்து பொம்மை முத்திரைகளைச் சேகரியுங்கள்."],
  ["Open Discovery Trail →", "开启探索路线 →", "Buka Jejak Penerokaan →", "ஆய்வுப் பாதையைத் திற →"],

  // ---------- museum map ----------
  ["Get directions", "获取路线", "Dapatkan arah", "வழியைப் பெறு"],
  ["Start", "起点", "Mula", "தொடக்கம்"],
  ["Destination", "目的地", "Destinasi", "சேருமிடம்"],
  ["Search, e.g. “lift level 2”", "搜索，例如“2 楼电梯”", "Cari, cth. “lif aras 2”", "தேடுக, எ.கா. “நிலை 2 மின்தூக்கி”"],
  ["Search, e.g. “toilet” or “display 7”", "搜索，例如“洗手间”或“展柜 7”", "Cari, cth. “tandas” atau “pameran 7”", "தேடுக, எ.கா. “கழிப்பறை” அல்லது “காட்சி 7”"],
  ["Scan location QR", "扫描位置二维码", "Imbas QR lokasi", "இருப்பிட QR ஐ ஸ்கேன் செய்"],
  ["Scan the QR code near you to set your start.", "扫描你附近的二维码来设定起点。", "Imbas kod QR berhampiran anda untuk menetapkan titik mula.", "தொடக்க இடத்தை அமைக்க உங்களுக்கு அருகிலுள்ள QR குறியீட்டை ஸ்கேன் செய்யுங்கள்."],
  ["You can also search above, or tap a place on the map. This guide does not track where you are: your start is the place you choose or the last location QR code you scanned.", "你也可以在上方搜索，或点按地图上的地点。本指南不会追踪你的位置：起点是你选择的地点，或你上次扫描的位置二维码。", "Anda juga boleh mencari di atas, atau ketik satu tempat pada peta. Panduan ini tidak menjejaki kedudukan anda: titik mula ialah tempat yang anda pilih atau kod QR lokasi terakhir yang anda imbas.", "மேலே தேடலாம் அல்லது வரைபடத்தில் ஓர் இடத்தைத் தட்டலாம். இந்த வழிகாட்டி நீங்கள் இருக்கும் இடத்தைக் கண்காணிக்காது: நீங்கள் தேர்ந்தெடுத்த இடம் அல்லது கடைசியாக ஸ்கேன் செய்த இருப்பிட QR குறியீடே உங்கள் தொடக்கம்."],
  ["Floor", "楼层", "Aras", "தளம்"],
  ["Rooftop", "天台", "Bumbung", "மேல்தளம்"],
  ["Alfresco", "露天区", "Kawasan terbuka", "திறந்தவெளிப் பகுதி"],
  ["Void", "中空区", "Ruang kosong", "வெற்றிடம்"],
  ["External Catering", "外部餐饮", "Katering luar", "வெளி உணவு சேவை"],
  ["After-Hours Networking", "闭馆后交流活动", "Acara rangkaian selepas waktu operasi", "நேரத்திற்குப் பிந்தைய தொடர்பு நிகழ்வு"],
  ["Lift Lobby", "电梯厅", "Lobi lif", "மின்தூக்கி முகப்பு"],
  ["Event Space & Pop-up Exhibitions", "活动空间与快闪展览", "Ruang acara & pameran pop-up", "நிகழ்வு இடம் & தற்காலிகக் கண்காட்சிகள்"],
  ["Event Space", "活动空间", "Ruang acara", "நிகழ்வு இடம்"],
  ["& Pop-up Exhibitions", "与快闪展览", "& pameran pop-up", "& தற்காலிகக் கண்காட்சிகள்"],
  ["Sprinkler Pump Room", "喷淋泵房", "Bilik pam pemercik", "தெளிப்பான் பம்ப் அறை"],
  ["Staircase", "楼梯", "Tangga", "படிக்கட்டு"],
  ["Stairs", "楼梯", "Tangga", "படிக்கட்டு"],
  ["Lift", "电梯", "Lif", "மின்தூக்கி"],
  ["Exit sign", "出口标志", "Papan tanda keluar", "வெளியேறும் வழி அடையாளம்"],
  ["EXIT", "出口", "KELUAR", "வெளியேறு"],
  ["Toilet", "洗手间", "Tandas", "கழிப்பறை"],
  ["Accessible toilet", "无障碍洗手间", "Tandas mesra OKU", "அணுகல் வசதியுள்ள கழிப்பறை"],
  ["Introductory Monolith", "导览石碑", "Monolit pengenalan", "அறிமுகத் தூண்"],
  ["Exhibition Narrative Panel", "展览说明板", "Panel naratif pameran", "கண்காட்சி விளக்கப் பலகை"],
  ["Collection Panel", "藏品展板", "Panel koleksi", "தொகுப்புப் பலகை"],
  ["Artwork Gallery", "艺术作品展廊", "Galeri karya seni", "கலைப்படைப்புக் காட்சியகம்"],
  ["the lift", "电梯", "lif", "மின்தூக்கி"],
  ["the staircase", "楼梯", "tangga", "படிக்கட்டு"],
  ["the toilet", "洗手间", "tandas", "கழிப்பறை"],
  ["the accessible toilet", "无障碍洗手间", "tandas mesra OKU", "அணுகல் வசதியுள்ள கழிப்பறை"],
  ["the exit sign", "出口标志", "papan tanda keluar", "வெளியேறும் வழி அடையாளம்"],
  ["the gallery", "展厅", "galeri", "காட்சியகம்"],
  ["the lift lobby", "电梯厅", "lobi lif", "மின்தூக்கி முகப்பு"],
  ["the toilet lobby", "洗手间前厅", "lobi tandas", "கழிப்பறை முகப்பு"],
  ["the event space", "活动空间", "ruang acara", "நிகழ்வு இடம்"],
  ["Drag to move. Pinch, scroll or use the buttons to zoom. Tap a numbered pin to see what it is.", "拖动可移动地图。双指捏合、滚动或使用按钮可缩放。点按带数字的图钉查看详情。", "Seret untuk bergerak. Cubit, tatal atau guna butang untuk zum. Ketik pin bernombor untuk melihat butirannya.", "நகர்த்த இழுக்கவும். பெரிதாக்க விரல்களால் கிள்ளவும், உருட்டவும் அல்லது பொத்தான்களைப் பயன்படுத்தவும். எண் கொண்ட குறியைத் தட்டினால் அது என்ன என்பதைக் காணலாம்."],
  ["Drag to move. Pinch or use the buttons to zoom.", "拖动可移动地图。双指捏合或使用按钮可缩放。", "Seret untuk bergerak. Cubit atau guna butang untuk zum.", "நகர்த்த இழுக்கவும். பெரிதாக்க விரல்களால் கிள்ளவும் அல்லது பொத்தான்களைப் பயன்படுத்தவும்."],
  ["Zoom out", "缩小", "Zum keluar", "சிறிதாக்கு"],
  ["Zoom in", "放大", "Zum masuk", "பெரிதாக்கு"],
  ["Reset view", "重置视图", "Set semula paparan", "காட்சியை மீட்டமை"],
  ["Map key", "图例", "Petunjuk peta", "வரைபடக் குறிப்பு"],
  ["Display (tap for its name)", "展柜（点按查看名称）", "Pameran (ketik untuk namanya)", "காட்சி (பெயரைக் காண தட்டவும்)"],
  ["Not open to visitors", "不对访客开放", "Tidak dibuka kepada pelawat", "பார்வையாளர்களுக்கு அனுமதி இல்லை"],
  ["Close", "关闭", "Tutup", "மூடு"],
  ["Directions to here", "前往这里的路线", "Arah ke sini", "இங்கு செல்ல வழி"],
  ["Start from here", "从这里出发", "Mula dari sini", "இங்கிருந்து தொடங்கு"],
  ["Last scanned location", "上次扫描的位置", "Lokasi terakhir diimbas", "கடைசியாக ஸ்கேன் செய்த இடம்"],
  ["Your selected location", "你选择的位置", "Lokasi pilihan anda", "நீங்கள் தேர்ந்தெடுத்த இடம்"],
  ["· Last scanned location", "· 上次扫描的位置", "· Lokasi terakhir diimbas", "· கடைசியாக ஸ்கேன் செய்த இடம்"],
  ["· Your selected location", "· 你选择的位置", "· Lokasi pilihan anda", "· நீங்கள் தேர்ந்தெடுத்த இடம்"],
  ["Change", "更改", "Tukar", "மாற்று"],
  ["Change floor by", "换楼层方式", "Tukar aras dengan", "தளம் மாறும் முறை"],
  ["Step-free access has not been confirmed for this map yet. If you need a step-free route, please ask museum staff.", "此地图尚未确认无台阶通道。如需无台阶路线，请向博物馆工作人员查询。", "Akses tanpa tangga belum disahkan untuk peta ini. Jika anda memerlukan laluan tanpa tangga, sila tanya kakitangan muzium.", "இந்த வரைபடத்திற்குப் படியில்லா வழி இன்னும் உறுதிப்படுத்தப்படவில்லை. படியில்லா வழி தேவைப்பட்டால் அருங்காட்சியகப் பணியாளர்களிடம் கேளுங்கள்."],
  ["Clear", "清除", "Kosongkan", "அழி"],
  ["on your route", "在你的路线上", "dalam laluan anda", "உங்கள் பாதையில்"],
  ["Change floor", "换楼层", "Tukar aras", "தளம் மாறவும்"],
  ["Arrive here", "到达这里", "Tiba di sini", "இங்கு வந்து சேரவும்"],
  ["a location QR code", "位置二维码", "kod QR lokasi", "இருப்பிட QR குறியீடு"],
  ["That is not a museum location code. Look for the QR code marked “You are here”.", "这不是博物馆的位置二维码。请寻找标有“You are here”的二维码。", "Itu bukan kod lokasi muzium. Cari kod QR yang bertanda “You are here”.", "இது அருங்காட்சியக இருப்பிடக் குறியீடு அல்ல. “You are here” எனக் குறிக்கப்பட்ட QR குறியீட்டைத் தேடுங்கள்."],
  ["Your start and destination are the same place. Please choose a different destination.", "起点和目的地是同一个地方。请选择其他目的地。", "Titik mula dan destinasi anda adalah tempat yang sama. Sila pilih destinasi lain.", "தொடக்கமும் சேருமிடமும் ஒரே இடம். வேறு சேருமிடத்தைத் தேர்ந்தெடுக்கவும்."],
  ["Sorry, we do not have a confirmed route between these two places yet. Please ask museum staff.", "抱歉，这两个地点之间暂时没有已确认的路线。请向博物馆工作人员查询。", "Maaf, kami belum mempunyai laluan yang disahkan antara dua tempat ini. Sila tanya kakitangan muzium.", "மன்னிக்கவும், இந்த இரண்டு இடங்களுக்கு இடையே உறுதிப்படுத்தப்பட்ட வழி இன்னும் இல்லை. அருங்காட்சியகப் பணியாளர்களிடம் கேளுங்கள்."],

  // ---------- QR scanner ----------
  ["Scan the QR code", "扫描二维码", "Imbas kod QR", "QR குறியீட்டை ஸ்கேன் செய்யுங்கள்"],
  ["Scan QR code", "扫描二维码", "Imbas kod QR", "QR குறியீட்டை ஸ்கேன் செய்"],
  ["Close scanner", "关闭扫描器", "Tutup pengimbas", "ஸ்கேனரை மூடு"],
  ["Looking for:", "正在寻找：", "Sedang mencari:", "தேடுவது:"],
  ["Camera view", "相机画面", "Paparan kamera", "கேமரா காட்சி"],
  ["Starting the camera…", "正在启动相机…", "Memulakan kamera…", "கேமரா தொடங்குகிறது…"],
  ["Hold the QR code inside the square.", "请将二维码对准方框内。", "Halakan kod QR di dalam petak.", "QR குறியீட்டைச் சதுரத்திற்குள் வைத்திருங்கள்."],
  ["Camera not working? Type the code printed under the QR code:", "相机无法使用？请输入二维码下方印的代码：", "Kamera tidak berfungsi? Taip kod yang dicetak di bawah kod QR:", "கேமரா வேலை செய்யவில்லையா? QR குறியீட்டின் கீழ் அச்சிடப்பட்ட குறியீட்டை உள்ளிடவும்:"],
  ["Check code", "检查代码", "Semak kod", "குறியீட்டைச் சரிபார்"],
  ["Try again", "重试", "Cuba lagi", "மீண்டும் முயற்சி செய்"],
  ["The camera is not available on this page.", "此页面无法使用相机。", "Kamera tidak tersedia pada halaman ini.", "இந்தப் பக்கத்தில் கேமரா கிடைக்கவில்லை."],
  ["Browsers only allow the camera on secure (https) pages. You can still type the code printed under the QR code below.", "浏览器只允许在安全（https）页面使用相机。你仍可在下方输入二维码下方印的代码。", "Pelayar hanya membenarkan kamera pada halaman selamat (https). Anda masih boleh menaip kod yang dicetak di bawah kod QR di bawah.", "பாதுகாப்பான (https) பக்கங்களில் மட்டுமே உலாவிகள் கேமராவை அனுமதிக்கும். QR குறியீட்டின் கீழ் அச்சிடப்பட்ட குறியீட்டைக் கீழே உள்ளிடலாம்."],
  ["Camera permission is turned off.", "相机权限已关闭。", "Kebenaran kamera dimatikan.", "கேமரா அனுமதி முடக்கப்பட்டுள்ளது."],
  ["To turn it on: tap the lock or camera icon beside the web address, set Camera to “Allow”, then press “Try again”. Or type the code printed under the QR code below.", "开启方法：点按网址旁的锁形或相机图标，将相机设为“允许”，然后按“重试”。你也可以在下方输入二维码下方印的代码。", "Untuk menghidupkannya: ketik ikon kunci atau kamera di sebelah alamat web, tetapkan Kamera kepada “Benarkan”, kemudian tekan “Cuba lagi”. Atau taip kod yang dicetak di bawah kod QR di bawah.", "இயக்க: இணைய முகவரிக்கு அருகிலுள்ள பூட்டு அல்லது கேமரா ஐகானைத் தட்டி, கேமராவை “அனுமதி” என அமைத்து, “மீண்டும் முயற்சி செய்” என்பதை அழுத்தவும். அல்லது QR குறியீட்டின் கீழ் அச்சிடப்பட்ட குறியீட்டைக் கீழே உள்ளிடவும்."],
  ["No camera was found on this device.", "此设备上找不到相机。", "Tiada kamera ditemui pada peranti ini.", "இந்தச் சாதனத்தில் கேமரா இல்லை."],
  ["Type the code printed under the QR code below.", "请在下方输入二维码下方印的代码。", "Taip kod yang dicetak di bawah kod QR di bawah.", "QR குறியீட்டின் கீழ் அச்சிடப்பட்ட குறியீட்டைக் கீழே உள்ளிடவும்."],
  ["The camera is being used by another app.", "相机正被其他应用使用。", "Kamera sedang digunakan oleh aplikasi lain.", "கேமராவை வேறொரு செயலி பயன்படுத்துகிறது."],
  ["Close other apps or tabs that use the camera, then press “Try again”.", "请关闭其他使用相机的应用或标签页，然后按“重试”。", "Tutup aplikasi atau tab lain yang menggunakan kamera, kemudian tekan “Cuba lagi”.", "கேமராவைப் பயன்படுத்தும் பிற செயலிகள் அல்லது தாவல்களை மூடி, “மீண்டும் முயற்சி செய்” என்பதை அழுத்தவும்."],
  ["The camera could not start.", "相机无法启动。", "Kamera tidak dapat dimulakan.", "கேமராவைத் தொடங்க முடியவில்லை."],
  ["Press “Try again”, or type the code printed under the QR code below.", "请按“重试”，或在下方输入二维码下方印的代码。", "Tekan “Cuba lagi”, atau taip kod yang dicetak di bawah kod QR di bawah.", "“மீண்டும் முயற்சி செய்” என்பதை அழுத்தவும், அல்லது QR குறியீட்டின் கீழ் அச்சிடப்பட்ட குறியீட்டைக் கீழே உள்ளிடவும்."],

  // ---------- discovery trail ----------
  ["Discovery Trail", "探索路线", "Jejak Penerokaan", "ஆய்வுப் பாதை"],
  ["Demo trail", "演示路线", "Jejak demo", "டெமோ பாதை"],
  ["Toy Explorer Trail", "玩具探险家路线", "Jejak Peneroka Mainan", "பொம்மை ஆய்வாளர் பாதை"],
  ["Follow the clues, find each spot in the museum and scan its QR code to collect a toy stamp.", "跟着线索，找到博物馆里的每个地点，扫描二维码收集玩具印章。", "Ikut petunjuk, cari setiap lokasi di muzium dan imbas kod QR untuk mengumpul cop mainan.", "குறிப்புகளைப் பின்பற்றி, அருங்காட்சியகத்தில் உள்ள ஒவ்வோர் இடத்தையும் கண்டுபிடித்து, அதன் QR குறியீட்டை ஸ்கேன் செய்து பொம்மை முத்திரையைச் சேகரியுங்கள்."],
  ["Overall progress", "总进度", "Kemajuan keseluruhan", "மொத்த முன்னேற்றம்"],
  ["Stamps collected", "已收集的印章", "Cop dikumpul", "சேகரித்த முத்திரைகள்"],
  ["Playing as a guest: stamps are saved on this device only.", "你正以访客身份游玩：印章只保存在此设备上。", "Bermain sebagai tetamu: cop disimpan pada peranti ini sahaja.", "விருந்தினராக விளையாடுகிறீர்கள்: முத்திரைகள் இந்தச் சாதனத்தில் மட்டுமே சேமிக்கப்படும்."],
  ["Saved on this device.", "已保存在此设备上。", "Disimpan pada peranti ini.", "இந்தச் சாதனத்தில் சேமிக்கப்பட்டது."],
  ["Trail floors", "路线楼层", "Aras jejak", "பாதைத் தளங்கள்"],
  ["Now playing", "进行中", "Sedang dimainkan", "இப்போது விளையாடுகிறீர்கள்"],
  ["Locked", "未解锁", "Terkunci", "பூட்டப்பட்டுள்ளது"],
  ["Complete", "已完成", "Selesai", "முடிந்தது"],
  ["Adventure complete!", "探险完成！", "Pengembaraan selesai!", "சாகசம் நிறைவு!"],
  ["See my rewards", "查看我的奖励", "Lihat ganjaran saya", "என் வெகுமதிகளைக் காண்க"],
  ["Restart demo trail", "重新开始演示路线", "Mulakan semula jejak demo", "டெமோ பாதையை மீண்டும் தொடங்கு"],
  ["Rocket Launch Pad", "火箭发射台", "Tapak Pelancaran Roket", "ராக்கெட் ஏவுதளம்"],
  ["Blast off! Leave the lift lobby and walk into the big gallery. Look for the largest display case standing on its own in the middle of the room.", "发射升空！离开电梯厅，走进大展厅。找一找独自立在房间中央、最大的那个展柜。", "Berlepas! Tinggalkan lobi lif dan masuk ke galeri besar. Cari kotak pameran terbesar yang berdiri sendiri di tengah bilik.", "புறப்படுங்கள்! மின்தூக்கி முகப்பை விட்டு பெரிய காட்சியகத்திற்குள் செல்லுங்கள். அறையின் நடுவில் தனியாக நிற்கும் மிகப்பெரிய காட்சிப் பெட்டியைத் தேடுங்கள்."],
  ["It is display 5 on the map: the wide case on the left side of the gallery, away from the walls.", "它是地图上的展柜 5：位于展厅左侧、不靠墙的宽展柜。", "Ia ialah pameran 5 pada peta: kotak lebar di sebelah kiri galeri, jauh dari dinding.", "வரைபடத்தில் இது காட்சி 5: காட்சியகத்தின் இடப்பக்கத்தில், சுவர்களிலிருந்து விலகி உள்ள அகலமான பெட்டி."],
  ["Rocket Stamp", "火箭印章", "Cop Roket", "ராக்கெட் முத்திரை"],
  ["Robot Parade", "机器人巡游", "Perarakan Robot", "ரோபோ அணிவகுப்பு"],
  ["Beep boop! March along the long row of displays on the bottom wall of the gallery. Your next stamp waits near the middle of the row.", "哔哔啵！沿着展厅下方墙边的一长排展柜前进。下一枚印章就在这排的中间附近等着你。", "Bip bup! Berjalan di sepanjang barisan panjang pameran di dinding bawah galeri. Cop seterusnya menanti berhampiran tengah barisan.", "பீப் பூப்! காட்சியகத்தின் கீழ்ச் சுவரில் உள்ள நீண்ட காட்சி வரிசையில் நடந்து செல்லுங்கள். அடுத்த முத்திரை வரிசையின் நடுப்பகுதியில் காத்திருக்கிறது."],
  ["It is display 18 on the map. From the lift lobby opening, walk straight to the far wall and turn right.", "它是地图上的展柜 18。从电梯厅出口一直走到尽头的墙边，然后右转。", "Ia ialah pameran 18 pada peta. Dari pintu lobi lif, jalan terus ke dinding hujung dan belok kanan.", "வரைபடத்தில் இது காட்சி 18. மின்தூக்கி முகப்பு வாயிலிலிருந்து எதிர்ச்சுவர் வரை நேராகச் சென்று வலப்பக்கம் திரும்புங்கள்."],
  ["Robot Stamp", "机器人印章", "Cop Robot", "ரோபோ முத்திரை"],
  ["Spinning Top Corner", "陀螺角", "Sudut Gasing", "பம்பர மூலை"],
  ["Round and round! On Level 3, leave the lift lobby and find the short row of displays along the bottom wall of the gallery.", "转呀转！在 3 楼离开电梯厅，找到展厅下方墙边的一小排展柜。", "Pusing dan pusing! Di Aras 3, tinggalkan lobi lif dan cari barisan pendek pameran di sepanjang dinding bawah galeri.", "சுற்றிச் சுற்றி! நிலை 3 இல் மின்தூக்கி முகப்பை விட்டு, காட்சியகத்தின் கீழ்ச் சுவரை ஒட்டிய சிறிய காட்சி வரிசையைக் கண்டுபிடியுங்கள்."],
  ["It is display 4 on the map, the third case in the row counting from the left.", "它是地图上的展柜 4，是这排从左数起的第三个展柜。", "Ia ialah pameran 4 pada peta, kotak ketiga dalam barisan dikira dari kiri.", "வரைபடத்தில் இது காட்சி 4; இடமிருந்து எண்ணினால் வரிசையில் மூன்றாவது பெட்டி."],
  ["Spinning Top Stamp", "陀螺印章", "Cop Gasing", "பம்பர முத்திரை"],
  ["Need a hint?", "需要提示吗？", "Perlukan petunjuk?", "குறிப்பு வேண்டுமா?"],
  ["Show me the way", "带我去", "Tunjukkan jalan", "வழியைக் காட்டு"],
  ["Hint:", "提示：", "Petunjuk:", "குறிப்பு:"],
  ["You finished this floor!", "你已完成这一层！", "Anda telah selesai di aras ini!", "இந்தத் தளத்தை முடித்துவிட்டீர்கள்!"],
  ["Every spot on this floor has been found. Tap a floor above to look back at your trail.", "这一层的所有地点都已找到。点按上方的楼层可回顾你的路线。", "Semua lokasi di aras ini telah ditemui. Ketik aras di atas untuk melihat semula jejak anda.", "இந்தத் தளத்தின் எல்லா இடங்களும் கண்டுபிடிக்கப்பட்டுவிட்டன. உங்கள் பாதையைத் திரும்பிப் பார்க்க மேலே ஒரு தளத்தைத் தட்டவும்."],
  ["Stamp album", "印章册", "Album cop", "முத்திரை ஆல்பம்"],
  ["Stamp not collected yet", "尚未收集印章", "Cop belum dikumpul", "முத்திரை இன்னும் சேகரிக்கப்படவில்லை"],
  ["Not found yet", "尚未找到", "Belum ditemui", "இன்னும் கண்டுபிடிக்கப்படவில்லை"],
  ["Stamp collected!", "印章已收集！", "Cop dikumpul!", "முத்திரை சேகரிக்கப்பட்டது!"],
  ["You finished the whole adventure!", "你完成了整个探险！", "Anda telah menamatkan keseluruhan pengembaraan!", "முழு சாகசத்தையும் முடித்துவிட்டீர்கள்!"],
  ["Your next clue is ready.", "下一条线索已准备好。", "Petunjuk seterusnya sudah sedia.", "உங்கள் அடுத்த குறிப்பு தயார்."],
  ["See my stamps", "查看我的印章", "Lihat cop saya", "என் முத்திரைகளைக் காண்க"],
  ["Next clue", "下一条线索", "Petunjuk seterusnya", "அடுத்த குறிப்பு"],
  ["That is a Museum Map location code, not a Discovery Trail code. Look for the trail QR code beside the display.", "这是博物馆地图的位置二维码，不是探索路线的二维码。请寻找展柜旁的路线二维码。", "Itu kod lokasi Peta Muzium, bukan kod Jejak Penerokaan. Cari kod QR jejak di sebelah pameran.", "இது அருங்காட்சியக வரைபட இருப்பிடக் குறியீடு; ஆய்வுப் பாதைக் குறியீடு அல்ல. காட்சிக்கு அருகிலுள்ள பாதை QR குறியீட்டைத் தேடுங்கள்."],
  ["That code is not part of the Discovery Trail. Look for the trail QR code beside the display.", "这个代码不属于探索路线。请寻找展柜旁的路线二维码。", "Kod itu bukan sebahagian daripada Jejak Penerokaan. Cari kod QR jejak di sebelah pameran.", "இந்தக் குறியீடு ஆய்வுப் பாதையைச் சேர்ந்தது அல்ல. காட்சிக்கு அருகிலுள்ள பாதை QR குறியீட்டைத் தேடுங்கள்."],
  ["You have already finished the adventure.", "你已经完成探险了。", "Anda sudah menamatkan pengembaraan.", "நீங்கள் ஏற்கெனவே சாகசத்தை முடித்துவிட்டீர்கள்."],

  // ---------- help: request form and status ----------
  ["Ask museum staff for help, see what to do in an emergency, and share your feedback.", "向博物馆工作人员求助、了解紧急情况下该怎么做，并分享你的反馈。", "Minta bantuan kakitangan muzium, ketahui apa yang perlu dilakukan semasa kecemasan, dan kongsi maklum balas anda.", "அருங்காட்சியகப் பணியாளர்களிடம் உதவி கேளுங்கள், அவசரநிலையில் என்ன செய்வது என்பதை அறியுங்கள், உங்கள் கருத்தைப் பகிருங்கள்."],
  ["How can staff recognise you? (optional)", "工作人员如何认出你？（可不填）", "Bagaimana kakitangan boleh mengenali anda? (pilihan)", "பணியாளர்கள் உங்களை எப்படி அடையாளம் காணலாம்? (விருப்பம்)"],
  ["For example: red jacket, with two children. Please do not write your name or phone number.", "例如：穿红色外套，带着两个孩子。请不要填写姓名或电话号码。", "Contohnya: jaket merah, bersama dua orang kanak-kanak. Sila jangan tulis nama atau nombor telefon anda.", "எடுத்துக்காட்டு: சிவப்பு ஜாக்கெட், இரண்டு குழந்தைகளுடன். உங்கள் பெயரையோ தொலைபேசி எண்ணையோ எழுத வேண்டாம்."],
  ["Your message was sent to staff", "你的信息已发送给工作人员", "Mesej anda telah dihantar kepada kakitangan", "உங்கள் செய்தி பணியாளர்களுக்கு அனுப்பப்பட்டது"],
  ["Staff have been told. Someone will come to you soon.", "工作人员已收到通知，很快会有人来找你。", "Kakitangan telah dimaklumkan. Seseorang akan datang kepada anda tidak lama lagi.", "பணியாளர்களுக்குத் தெரிவிக்கப்பட்டது. விரைவில் ஒருவர் உங்களிடம் வருவார்."],
  ["A staff member is on the way", "工作人员正在赶来", "Seorang kakitangan sedang dalam perjalanan", "ஒரு பணியாளர் வந்துகொண்டிருக்கிறார்"],
  ["Staff have seen your message and are coming to you.", "工作人员已看到你的信息，正在前来。", "Kakitangan telah melihat mesej anda dan sedang datang kepada anda.", "பணியாளர்கள் உங்கள் செய்தியைப் பார்த்து உங்களிடம் வந்துகொண்டிருக்கிறார்கள்."],
  ["Staff marked your request as done", "工作人员已将你的请求标记为完成", "Kakitangan telah menandakan permintaan anda sebagai selesai", "பணியாளர்கள் உங்கள் கோரிக்கையை முடிந்ததாகக் குறித்துள்ளனர்"],
  ["We hope that helped. You can send another message if you still need help.", "希望这对你有帮助。如果仍需要帮助，可以再发送一条信息。", "Kami harap ia membantu. Anda boleh menghantar mesej lain jika masih memerlukan bantuan.", "அது உதவியிருக்கும் என நம்புகிறோம். இன்னும் உதவி தேவைப்பட்டால் மற்றொரு செய்தியை அனுப்பலாம்."],
  ["You cancelled this request", "你已取消此请求", "Anda telah membatalkan permintaan ini", "இந்தக் கோரிக்கையை நீங்கள் ரத்து செய்தீர்கள்"],
  ["Staff have been told that you no longer need help.", "工作人员已获知你不再需要帮助。", "Kakitangan telah dimaklumkan bahawa anda tidak lagi memerlukan bantuan.", "உங்களுக்கு இனி உதவி தேவையில்லை என்று பணியாளர்களுக்குத் தெரிவிக்கப்பட்டது."],
  ["Staff came but could not find you", "工作人员来过，但没有找到你", "Kakitangan datang tetapi tidak dapat mencari anda", "பணியாளர்கள் வந்தனர், ஆனால் உங்களைக் கண்டுபிடிக்க முடியவில்லை"],
  ["Please send a new message from where you are now, or speak to any staff member.", "请从你现在的位置重新发送信息，或直接告诉任何一位工作人员。", "Sila hantar mesej baharu dari tempat anda berada sekarang, atau bercakap dengan mana-mana kakitangan.", "நீங்கள் இப்போது இருக்கும் இடத்திலிருந்து புதிய செய்தியை அனுப்புங்கள், அல்லது எந்தப் பணியாளரிடமாவது பேசுங்கள்."],
  ["Please stay where you are so staff can find you.", "请留在原地，方便工作人员找到你。", "Sila tunggu di tempat anda supaya kakitangan dapat mencari anda.", "பணியாளர்கள் உங்களைக் கண்டுபிடிக்க, நீங்கள் இருக்கும் இடத்திலேயே இருங்கள்."],
  ["If you have to move, cancel this request and send a new one from your new place.", "如果必须离开，请取消此请求，并在新位置重新发送。", "Jika anda perlu beralih, batalkan permintaan ini dan hantar yang baharu dari tempat baharu anda.", "நீங்கள் இடம் மாற வேண்டியிருந்தால், இந்தக் கோரிக்கையை ரத்து செய்து புதிய இடத்திலிருந்து புதியதை அனுப்புங்கள்."],
  ["This page checks for updates every 10 seconds.", "此页面每 10 秒检查一次更新。", "Halaman ini menyemak kemas kini setiap 10 saat.", "இந்தப் பக்கம் ஒவ்வொரு 10 விநாடிக்கும் புதுப்பிப்புகளைச் சரிபார்க்கிறது."],
  ["We could not check for updates just now. We will keep trying.", "暂时无法检查更新。我们会继续尝试。", "Kami tidak dapat menyemak kemas kini sebentar tadi. Kami akan terus mencuba.", "இப்போது புதுப்பிப்புகளைச் சரிபார்க்க முடியவில்லை. தொடர்ந்து முயற்சிப்போம்."],
  ["I no longer need help", "我不再需要帮助", "Saya tidak lagi memerlukan bantuan", "எனக்கு இனி உதவி தேவையில்லை"],
  ["Cancelling...", "正在取消...", "Membatalkan...", "ரத்து செய்யப்படுகிறது..."],
  ["We could not cancel your request. Please try again, or tell a staff member.", "无法取消你的请求。请再试一次，或告诉工作人员。", "Kami tidak dapat membatalkan permintaan anda. Sila cuba lagi, atau beritahu kakitangan.", "உங்கள் கோரிக்கையை ரத்து செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும், அல்லது பணியாளரிடம் தெரிவிக்கவும்."],
  ["If you need help faster, speak to any staff member.", "如果需要更快获得帮助，请直接告诉任何一位工作人员。", "Jika anda memerlukan bantuan dengan lebih cepat, bercakap dengan mana-mana kakitangan.", "விரைவாக உதவி தேவைப்பட்டால், எந்தப் பணியாளரிடமாவது பேசுங்கள்."],
  ["Tell staff your reference number if they ask.", "如果工作人员询问，请告诉他们你的参考编号。", "Beritahu kakitangan nombor rujukan anda jika mereka bertanya.", "பணியாளர்கள் கேட்டால் உங்கள் குறிப்பு எண்ணைச் சொல்லுங்கள்."],
  ["Reference number", "参考编号", "Nombor rujukan", "குறிப்பு எண்"],
  ["Send another message", "再发送一条信息", "Hantar mesej lain", "மற்றொரு செய்தியை அனுப்பு"],
  ["Not sure", "不确定", "Tidak pasti", "உறுதியாகத் தெரியவில்லை"],

  // ---------- help: FAQ ----------
  ["Frequently asked questions", "常见问题", "Soalan lazim", "அடிக்கடி கேட்கப்படும் கேள்விகள்"],
  ["Tap a question to see the answer.", "点按问题查看答案。", "Ketik soalan untuk melihat jawapannya.", "பதிலைக் காண ஒரு கேள்வியைத் தட்டவும்."],
  ["Expand all", "全部展开", "Kembangkan semua", "அனைத்தையும் விரி"],
  ["Collapse all", "全部收起", "Runtuhkan semua", "அனைத்தையும் சுருக்கு"],
  ["Planning your visit", "规划你的参观", "Merancang lawatan anda", "உங்கள் வருகையைத் திட்டமிடுதல்"],
  ["When is the museum open?", "博物馆什么时候开放？", "Bilakah muzium dibuka?", "அருங்காட்சியகம் எப்போது திறந்திருக்கும்?"],
  ["The museum is open from Tuesday to Sunday, 9:30 am to 6:30 pm. The last admission is at 5:30 pm. It is closed on Mondays.", "博物馆周二至周日开放，上午 9:30 至下午 6:30。最后入场时间为下午 5:30。周一闭馆。", "Muzium dibuka dari Selasa hingga Ahad, 9:30 pagi hingga 6:30 petang. Kemasukan terakhir pada 5:30 petang. Ia ditutup pada hari Isnin.", "அருங்காட்சியகம் செவ்வாய் முதல் ஞாயிறு வரை, காலை 9:30 முதல் மாலை 6:30 வரை திறந்திருக்கும். கடைசி நுழைவு மாலை 5:30 மணிக்கு. திங்கட்கிழமைகளில் மூடப்படும்."],
  ["Where is the museum?", "博物馆在哪里？", "Di manakah muzium ini?", "அருங்காட்சியகம் எங்கே உள்ளது?"],
  ["It is at 26 Seah Street, Singapore 188382, near Raffles Hotel. The nearest MRT stations are Bugis Station (Exit A) and Esplanade Station (Exit F), each about a 5 minute walk. City Hall Station (Exit A) is about 7 minutes and Bras Basah Station (Exit A) is about 10 minutes.", "地址是 26 Seah Street, Singapore 188382，靠近莱佛士酒店。最近的地铁站是武吉士站（A 出口）和滨海中心站（F 出口），步行各约 5 分钟。政府大厦站（A 出口）步行约 7 分钟，百胜站（A 出口）步行约 10 分钟。", "Ia terletak di 26 Seah Street, Singapore 188382, berhampiran Raffles Hotel. Stesen MRT terdekat ialah Stesen Bugis (Pintu A) dan Stesen Esplanade (Pintu F), masing-masing kira-kira 5 minit berjalan kaki. Stesen City Hall (Pintu A) kira-kira 7 minit dan Stesen Bras Basah (Pintu A) kira-kira 10 minit.", "இது 26 Seah Street, Singapore 188382 இல், ராஃபிள்ஸ் ஹோட்டலுக்கு அருகில் உள்ளது. அருகிலுள்ள MRT நிலையங்கள் பூகிஸ் நிலையம் (வெளிவழி A) மற்றும் எஸ்பிளனேட் நிலையம் (வெளிவழி F); ஒவ்வொன்றிலிருந்தும் சுமார் 5 நிமிட நடை. சிட்டி ஹால் நிலையம் (வெளிவழி A) சுமார் 7 நிமிடம், பிராஸ் பாசா நிலையம் (வெளிவழி A) சுமார் 10 நிமிடம்."],
  ["How much is a ticket?", "门票多少钱？", "Berapakah harga tiket?", "நுழைவுச்சீட்டு எவ்வளவு?"],
  ["Adult general admission starts from S$30. Children aged 6 and under enter free. Please check ticketing.emint.com for the current prices of child and senior tickets.", "成人普通门票 S$30 起。6 岁及以下儿童免费入场。儿童票和乐龄票的最新价格请查看 ticketing.emint.com。", "Kemasukan am dewasa bermula dari S$30. Kanak-kanak berumur 6 tahun ke bawah masuk percuma. Sila semak ticketing.emint.com untuk harga semasa tiket kanak-kanak dan warga emas.", "பெரியவர்களுக்கான பொது நுழைவு S$30 இலிருந்து தொடங்குகிறது. 6 வயது மற்றும் அதற்குக் குறைவான குழந்தைகளுக்கு இலவசம். குழந்தை மற்றும் மூத்தோர் சீட்டுகளின் தற்போதைய விலைக்கு ticketing.emint.com ஐப் பாருங்கள்."],
  ["How long should I stay?", "应该参观多久？", "Berapa lamakah patut saya berada di sini?", "எவ்வளவு நேரம் இருக்க வேண்டும்?"],
  ["Most visitors spend one to two hours. Allow more time if you join a guided tour or use the augmented reality experience.", "大多数访客会参观一到两小时。如果参加导览或使用增强现实体验，请预留更多时间。", "Kebanyakan pelawat meluangkan satu hingga dua jam. Peruntukkan lebih masa jika anda menyertai lawatan berpandu atau menggunakan pengalaman realiti terimbuh.", "பெரும்பாலான பார்வையாளர்கள் ஒன்று முதல் இரண்டு மணி நேரம் செலவிடுகிறார்கள். வழிகாட்டிச் சுற்றுலாவில் சேர்ந்தாலோ மிகை மெய்ம்மை அனுபவத்தைப் பயன்படுத்தினாலோ கூடுதல் நேரம் ஒதுக்குங்கள்."],
  ["Can I join a guided tour?", "可以参加导览吗？", "Bolehkah saya menyertai lawatan berpandu?", "வழிகாட்டிச் சுற்றுலாவில் சேரலாமா?"],
  ["Yes. The Around the World in 60 Minutes tour starts from S$33 and must be booked before your visit at ticketing.emint.com. Some tickets also include a short 15 minute tour, which depends on availability.", "可以。“Around the World in 60 Minutes”导览 S$33 起，须在参观前通过 ticketing.emint.com 预订。部分门票还包含 15 分钟的简短导览，视情况安排。", "Ya. Lawatan “Around the World in 60 Minutes” bermula dari S$33 dan mesti ditempah sebelum lawatan anda di ticketing.emint.com. Sesetengah tiket juga merangkumi lawatan pendek 15 minit, bergantung pada ketersediaan.", "ஆம். “Around the World in 60 Minutes” சுற்றுலா S$33 இலிருந்து தொடங்குகிறது; வருகைக்கு முன் ticketing.emint.com இல் முன்பதிவு செய்ய வேண்டும். சில சீட்டுகளில் 15 நிமிடக் குறுஞ்சுற்றுலாவும் அடங்கும்; அது கிடைப்பதைப் பொறுத்தது."],
  ["Inside the museum", "馆内", "Di dalam muzium", "அருங்காட்சியகத்திற்குள்"],
  ["Which floor should I start on?", "应该从哪一层开始？", "Dari aras manakah patut saya mulakan?", "எந்தத் தளத்திலிருந்து தொடங்க வேண்டும்?"],
  ["You can start on any level. The levels are Level 2 Collectables, Level 3 Childhood Favourites, Level 4 Characters and Level 5 Outerspace. The Rooftop has the vintage enamel sign gallery. Take the stairs to see small exhibitions on the stairwell landings.", "你可以从任何一层开始。各层分别是：2 楼“收藏品”、3 楼“童年最爱”、4 楼“人物角色”和 5 楼“外太空”。天台设有复古搪瓷招牌展廊。走楼梯还可以看到楼梯平台上的小型展览。", "Anda boleh bermula di mana-mana aras. Aras-arasnya ialah Aras 2 Barang Koleksi, Aras 3 Kegemaran Zaman Kanak-kanak, Aras 4 Watak dan Aras 5 Angkasa Lepas. Bumbung menempatkan galeri papan tanda enamel vintaj. Gunakan tangga untuk melihat pameran kecil di pelantar tangga.", "எந்தத் தளத்திலிருந்தும் தொடங்கலாம். தளங்கள்: நிலை 2 சேகரிப்புப் பொருள்கள், நிலை 3 குழந்தைப் பருவ விருப்பங்கள், நிலை 4 கதாபாத்திரங்கள், நிலை 5 விண்வெளி. மேல்தளத்தில் பழங்கால எனாமல் பலகைக் காட்சியகம் உள்ளது. படிக்கட்டுத் தளங்களில் உள்ள சிறு கண்காட்சிகளைக் காண படிக்கட்டுகளைப் பயன்படுத்துங்கள்."],
  ["Can I take photos?", "可以拍照吗？", "Bolehkah saya mengambil gambar?", "புகைப்படம் எடுக்கலாமா?"],
  ["Photos are reported to be allowed in most areas. Please do not use flash or tripods, because they can harm the exhibits.", "据了解，大部分区域允许拍照。请不要使用闪光灯或三脚架，以免损坏展品。", "Dilaporkan bahawa gambar dibenarkan di kebanyakan kawasan. Sila jangan gunakan denyar atau tripod kerana ia boleh merosakkan pameran.", "பெரும்பாலான பகுதிகளில் புகைப்படம் எடுக்க அனுமதி உள்ளதாகத் தெரிவிக்கப்படுகிறது. காட்சிப் பொருள்களுக்குச் சேதம் ஏற்படலாம் என்பதால் ஃபிளாஷ் அல்லது முக்காலியைப் பயன்படுத்த வேண்டாம்."],
  ["Is the museum wheelchair accessible?", "博物馆方便轮椅通行吗？", "Adakah muzium ini mesra kerusi roda?", "அருங்காட்சியகத்தில் சக்கர நாற்காலி வசதி உள்ளதா?"],
  ["Ticketing partners describe the museum as wheelchair accessible. If you need special arrangements, please contact the museum before you visit.", "票务合作伙伴表示博物馆方便轮椅通行。如需特别安排，请在参观前联系博物馆。", "Rakan tiket menyatakan muzium ini mesra kerusi roda. Jika anda memerlukan urusan khas, sila hubungi muzium sebelum lawatan anda.", "சீட்டு விற்பனைக் கூட்டாளர்கள் அருங்காட்சியகம் சக்கர நாற்காலிக்கு ஏற்றது எனக் குறிப்பிடுகின்றனர். சிறப்பு ஏற்பாடுகள் தேவைப்பட்டால், வருகைக்கு முன் அருங்காட்சியகத்தைத் தொடர்புகொள்ளுங்கள்."],
  ["Are there toilets and seats?", "有洗手间和座位吗？", "Adakah terdapat tandas dan tempat duduk?", "கழிப்பறைகளும் இருக்கைகளும் உள்ளனவா?"],
  ["Visitors report toilets and seating on the floors. The museum has not confirmed this, so please ask staff if you need help.", "有访客表示各楼层设有洗手间和座位。博物馆尚未确认，如需帮助请询问工作人员。", "Pelawat melaporkan terdapat tandas dan tempat duduk di aras-aras. Muzium belum mengesahkannya, jadi sila tanya kakitangan jika anda memerlukan bantuan.", "தளங்களில் கழிப்பறைகளும் இருக்கைகளும் இருப்பதாகப் பார்வையாளர்கள் தெரிவிக்கின்றனர். அருங்காட்சியகம் இதை உறுதிப்படுத்தவில்லை; உதவி தேவைப்பட்டால் பணியாளர்களிடம் கேளுங்கள்."],
  ["Using this guide", "使用本指南", "Menggunakan panduan ini", "இந்த வழிகாட்டியைப் பயன்படுத்துதல்"],
  ["What can the chatbot help me with?", "聊天机器人能帮我什么？", "Apakah yang boleh dibantu oleh chatbot?", "சாட்பாட் எனக்கு எதில் உதவும்?"],
  ["The chatbot can answer questions about MINT, such as opening hours, tickets and what is on each level. It may not know everything. For other help, ask a member of staff.", "聊天机器人可以回答有关 MINT 的问题，例如开放时间、门票和各楼层的展览。它不一定无所不知。如需其他帮助，请询问工作人员。", "Chatbot boleh menjawab soalan tentang MINT, seperti waktu operasi, tiket dan apa yang ada di setiap aras. Ia mungkin tidak tahu semuanya. Untuk bantuan lain, tanya kakitangan.", "திறக்கும் நேரம், சீட்டுகள், ஒவ்வொரு தளத்திலும் என்ன உள்ளது போன்ற MINT பற்றிய கேள்விகளுக்குச் சாட்பாட் பதிலளிக்கும். அதற்கு எல்லாம் தெரிந்திருக்காது. பிற உதவிக்குப் பணியாளரிடம் கேளுங்கள்."],
  ["Open the chatbot", "打开聊天机器人", "Buka chatbot", "சாட்பாட்டைத் திற"],
  ["How do I ask staff for help?", "如何向工作人员求助？", "Bagaimanakah saya meminta bantuan kakitangan?", "பணியாளர்களிடம் உதவி கேட்பது எப்படி?"],
  ["Use the help request form at the top of this page. Choose the area you are in, describe what you need, and send it. Your request and area are shared with museum staff. We do not ask for your name.", "使用本页顶部的求助表格。选择你所在的区域，说明你的需要，然后发送。你的请求和所在区域会分享给博物馆工作人员。我们不会询问你的姓名。", "Gunakan borang permintaan bantuan di bahagian atas halaman ini. Pilih kawasan anda, terangkan apa yang anda perlukan, dan hantar. Permintaan dan kawasan anda dikongsi dengan kakitangan muzium. Kami tidak meminta nama anda.", "இந்தப் பக்கத்தின் மேலே உள்ள உதவிக் கோரிக்கைப் படிவத்தைப் பயன்படுத்துங்கள். நீங்கள் இருக்கும் பகுதியைத் தேர்ந்தெடுத்து, உங்களுக்கு என்ன தேவை என்பதை விவரித்து அனுப்புங்கள். உங்கள் கோரிக்கையும் பகுதியும் அருங்காட்சியகப் பணியாளர்களுடன் பகிரப்படும். உங்கள் பெயரை நாங்கள் கேட்பதில்லை."],
  ["Who can I contact outside the museum?", "在博物馆外可以联系谁？", "Siapakah yang boleh saya hubungi di luar muzium?", "அருங்காட்சியகத்திற்கு வெளியே யாரைத் தொடர்புகொள்ளலாம்?"],
  ["Message or call +65 8339 8966, or email info@emint.com.", "请发信息或致电 +65 8339 8966，或发电邮至 info@emint.com。", "Hantar mesej atau hubungi +65 8339 8966, atau e-mel info@emint.com.", "+65 8339 8966 என்ற எண்ணுக்குச் செய்தி அனுப்புங்கள் அல்லது அழையுங்கள், அல்லது info@emint.com க்கு மின்னஞ்சல் அனுப்புங்கள்."],

  // ---------- help: user guide ----------
  ["How to use the Museum Map and Discovery Trail", "如何使用博物馆地图和探索路线", "Cara menggunakan Peta Muzium dan Jejak Penerokaan", "அருங்காட்சியக வரைபடத்தையும் ஆய்வுப் பாதையையும் பயன்படுத்துவது எப்படி"],
  ["Pick a guide, then follow the steps one by one.", "选择一份指南，然后按步骤逐一操作。", "Pilih satu panduan, kemudian ikut langkah satu demi satu.", "ஒரு வழிகாட்டியைத் தேர்ந்தெடுத்து, படிகளை ஒவ்வொன்றாகப் பின்பற்றுங்கள்."],
  ["Choose a guide", "选择指南", "Pilih panduan", "வழிகாட்டியைத் தேர்ந்தெடு"],
  ["You are ready to explore!", "你可以开始探索了！", "Anda sudah bersedia untuk meneroka!", "நீங்கள் ஆராயத் தயார்!"],
  ["Got it", "知道了", "Faham", "புரிந்தது"],
  ["Done", "完成", "Selesai", "முடிந்தது"],
  ["Museum Map", "博物馆地图", "Peta Muzium", "அருங்காட்சியக வரைபடம்"],
  ["Use the map to find your way around the floors of the museum.", "使用地图在博物馆各楼层找到方向。", "Gunakan peta untuk mencari jalan di aras-aras muzium.", "அருங்காட்சியகத் தளங்களில் வழி கண்டறிய வரைபடத்தைப் பயன்படுத்துங்கள்."],
  ["Open the Museum Map", "打开博物馆地图", "Buka Peta Muzium", "அருங்காட்சியக வரைபடத்தைத் திற"],
  ["Open the Museum Map from the card on the Home page.", "从首页的卡片打开博物馆地图。", "Buka Peta Muzium daripada kad di halaman Utama.", "முகப்புப் பக்கத்தில் உள்ள அட்டையிலிருந்து அருங்காட்சியக வரைபடத்தைத் திறக்கவும்."],
  ["Choose a floor", "选择楼层", "Pilih aras", "தளத்தைத் தேர்ந்தெடு"],
  ["Use the floor selector to pick a floor.", "使用楼层选择器选择楼层。", "Gunakan pemilih aras untuk memilih aras.", "தளத் தேர்வியைப் பயன்படுத்தி ஒரு தளத்தைத் தேர்ந்தெடுக்கவும்."],
  ["Look at the floor map", "查看楼层地图", "Lihat peta aras", "தள வரைபடத்தைப் பாருங்கள்"],
  ["The map shows the locations and exhibits on that floor.", "地图会显示该楼层的地点和展品。", "Peta menunjukkan lokasi dan pameran di aras itu.", "அந்தத் தளத்தில் உள்ள இடங்களையும் காட்சிப் பொருள்களையும் வரைபடம் காட்டுகிறது."],
  ["Select an exhibit", "选择展品", "Pilih pameran", "ஒரு காட்சிப் பொருளைத் தேர்ந்தெடு"],
  ["Select a location on the map to read its exhibit details.", "在地图上选择一个地点，查看展品详情。", "Pilih lokasi pada peta untuk membaca butiran pamerannya.", "காட்சிப் பொருள் விவரங்களைப் படிக்க வரைபடத்தில் ஓர் இடத்தைத் தேர்ந்தெடுக்கவும்."],
  ["Get directions after a QR scan", "扫描二维码后获取路线", "Dapatkan arah selepas imbasan QR", "QR ஸ்கேன் செய்த பின் வழியைப் பெறுங்கள்"],
  ["If you scan a location QR code, the map can show directions. This step is optional.", "扫描位置二维码后，地图可以显示路线。此步骤可选择是否进行。", "Jika anda mengimbas kod QR lokasi, peta boleh menunjukkan arah. Langkah ini adalah pilihan.", "இருப்பிட QR குறியீட்டை ஸ்கேன் செய்தால், வரைபடம் வழியைக் காட்டும். இந்தப் படி விருப்பத்திற்குரியது."],
  ["Follow the trail to find toys around the museum, answer clues and collect stamps.", "跟着路线在博物馆里寻找玩具、解答线索并收集印章。", "Ikut jejak untuk mencari mainan di sekitar muzium, jawab petunjuk dan kumpul cop.", "பாதையைப் பின்பற்றி அருங்காட்சியகத்தில் பொம்மைகளைக் கண்டுபிடித்து, குறிப்புகளுக்குப் பதிலளித்து, முத்திரைகளைச் சேகரியுங்கள்."],
  ["Open the Discovery Trail", "打开探索路线", "Buka Jejak Penerokaan", "ஆய்வுப் பாதையைத் திற"],
  ["Open the Discovery Trail from the navigation or from the card on the Home page.", "从导航栏或首页的卡片打开探索路线。", "Buka Jejak Penerokaan daripada navigasi atau daripada kad di halaman Utama.", "வழிசெலுத்தலிலிருந்தோ முகப்புப் பக்க அட்டையிலிருந்தோ ஆய்வுப் பாதையைத் திறக்கவும்."],
  ["See your missions", "查看你的任务", "Lihat misi anda", "உங்கள் பணிகளைப் பாருங்கள்"],
  ["Look at the list of missions and stamps to see what to do.", "查看任务和印章列表，了解要做什么。", "Lihat senarai misi dan cop untuk mengetahui apa yang perlu dilakukan.", "என்ன செய்ய வேண்டும் என்பதை அறிய பணிகள் மற்றும் முத்திரைகளின் பட்டியலைப் பாருங்கள்."],
  ["Find a toy and scan its code", "找到玩具并扫描二维码", "Cari mainan dan imbas kodnya", "ஒரு பொம்மையைக் கண்டுபிடித்து அதன் குறியீட்டை ஸ்கேன் செய்யுங்கள்"],
  ["Walk to a toy and scan its QR code to start its clue.", "走到玩具前，扫描二维码开始它的线索。", "Pergi ke mainan dan imbas kod QR untuk memulakan petunjuknya.", "ஒரு பொம்மையிடம் சென்று, அதன் குறிப்பைத் தொடங்க QR குறியீட்டை ஸ்கேன் செய்யுங்கள்."],
  ["Answer the clue", "解答线索", "Jawab petunjuk", "குறிப்புக்குப் பதிலளியுங்கள்"],
  ["Answer the question or clue for that toy to continue.", "回答该玩具的问题或线索以继续。", "Jawab soalan atau petunjuk untuk mainan itu untuk meneruskan.", "தொடர அந்தப் பொம்மைக்கான கேள்வி அல்லது குறிப்புக்குப் பதிலளியுங்கள்."],
  ["Collect a stamp", "收集印章", "Kumpul cop", "முத்திரையைச் சேகரியுங்கள்"],
  ["Finish a mission to collect a digital stamp.", "完成任务即可收集一枚数字印章。", "Selesaikan misi untuk mengumpul cop digital.", "டிஜிட்டல் முத்திரையைச் சேகரிக்க ஒரு பணியை முடியுங்கள்."],
  ["Check your reward", "查看你的奖励", "Semak ganjaran anda", "உங்கள் வெகுமதியைச் சரிபாருங்கள்"],
  ["Check your points and your progress towards a reward.", "查看你的积分和兑换奖励的进度。", "Semak mata anda dan kemajuan anda ke arah ganjaran.", "உங்கள் புள்ளிகளையும் வெகுமதியை நோக்கிய முன்னேற்றத்தையும் சரிபாருங்கள்."],

  // ---------- help: feedback ----------
  ["How would you rate this guide? Choose 1 to 5 stars.", "你会给本指南打几分？请选择 1 至 5 星。", "Bagaimanakah anda menilai panduan ini? Pilih 1 hingga 5 bintang.", "இந்த வழிகாட்டியை எவ்வாறு மதிப்பிடுவீர்கள்? 1 முதல் 5 நட்சத்திரங்களைத் தேர்ந்தெடுக்கவும்."],
  ["1 star is the lowest. 5 stars is the best.", "1 星最低，5 星最好。", "1 bintang paling rendah. 5 bintang paling baik.", "1 நட்சத்திரம் மிகக் குறைவு. 5 நட்சத்திரங்கள் மிகச் சிறந்தது."],
  ["No stars chosen yet", "尚未选择星级", "Belum memilih bintang", "நட்சத்திரம் இன்னும் தேர்ந்தெடுக்கப்படவில்லை"],
  ["Please choose a rating from 1 to 5 stars.", "请选择 1 至 5 星的评分。", "Sila pilih penilaian daripada 1 hingga 5 bintang.", "1 முதல் 5 நட்சத்திரங்களுக்குள் ஒரு மதிப்பீட்டைத் தேர்ந்தெடுக்கவும்."],

  // ---------- contact ----------
  ["Tuesday to Sunday, 9:30 am to 6:30 pm", "周二至周日，上午 9:30 至下午 6:30", "Selasa hingga Ahad, 9:30 pagi hingga 6:30 petang", "செவ்வாய் முதல் ஞாயிறு வரை, காலை 9:30 முதல் மாலை 6:30 வரை"],
  ["Last admission 5:30 pm", "最后入场时间：下午 5:30", "Kemasukan terakhir 5:30 petang", "கடைசி நுழைவு மாலை 5:30"],
  ["MINT Museum of Toys", "MINT 玩具博物馆", "MINT Museum of Toys", "MINT பொம்மை அருங்காட்சியகம்"],
  ["Phone / WhatsApp:", "电话 / WhatsApp：", "Telefon / WhatsApp:", "தொலைபேசி / WhatsApp:"],
  ["Opening hours:", "开放时间：", "Waktu operasi:", "திறக்கும் நேரம்:"],

  // ---------- privacy policy ----------
  ["MINTH has no age limit and can be used without an account. Creating an account needs only a name and a Gmail address. The Help and Feedback forms do not ask for a name or contact details.", "MINTH 没有年龄限制，无需账户也可使用。创建账户只需要名字和 Gmail 地址。求助和反馈表格不会询问姓名或联系方式。", "MINTH tiada had umur dan boleh digunakan tanpa akaun. Membuat akaun hanya memerlukan nama dan alamat Gmail. Borang Bantuan dan Maklum Balas tidak meminta nama atau butiran hubungan.", "MINTH க்கு வயது வரம்பு இல்லை; கணக்கு இல்லாமலும் பயன்படுத்தலாம். கணக்கை உருவாக்க ஒரு பெயரும் Gmail முகவரியும் மட்டுமே தேவை. உதவி மற்றும் கருத்துப் படிவங்கள் பெயரையோ தொடர்பு விவரங்களையோ கேட்பதில்லை."],

  // ---------- terms and conditions ----------
  ["3 October 2026", "2026 年 10 月 3 日", "3 Oktober 2026", "3 அக்டோபர் 2026"],
  ["MINTH is a prototype museum guide built by a student project team (“we”, “us”, or “our”) for the MINT Museum of Toys. Please take a moment to read these terms, which explain how you may use our website. By using MINTH, you agree to these Terms & Conditions.", "MINTH 是由学生项目团队（“我们”）为 MINT 玩具博物馆制作的博物馆指南原型。请花一点时间阅读这些条款，其中说明了你可以如何使用我们的网站。使用 MINTH 即表示你同意这些条款与条件。", "MINTH ialah prototaip panduan muzium yang dibina oleh pasukan projek pelajar (“kami”) untuk MINT Museum of Toys. Sila luangkan masa untuk membaca terma ini, yang menerangkan cara anda boleh menggunakan laman web kami. Dengan menggunakan MINTH, anda bersetuju dengan Terma & Syarat ini.", "MINTH என்பது MINT பொம்மை அருங்காட்சியகத்திற்காக ஒரு மாணவர் திட்டக் குழு (“நாங்கள்”) உருவாக்கிய அருங்காட்சியக வழிகாட்டி முன்மாதிரி. எங்கள் இணையதளத்தை நீங்கள் எவ்வாறு பயன்படுத்தலாம் என்பதை விளக்கும் இந்த விதிமுறைகளைச் சற்று நேரம் ஒதுக்கிப் படியுங்கள். MINTH ஐப் பயன்படுத்துவதன் மூலம் இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்கிறீர்கள்."],
  ["You are welcome to explore MINTH for personal and educational purposes. We kindly ask that you use the website lawfully and respect the rights of others.", "欢迎你出于个人和教育目的使用 MINTH。请合法使用本网站，并尊重他人的权利。", "Anda dialu-alukan untuk meneroka MINTH bagi tujuan peribadi dan pendidikan. Kami memohon agar anda menggunakan laman web ini secara sah dan menghormati hak orang lain.", "தனிப்பட்ட மற்றும் கல்வி நோக்கங்களுக்காக MINTH ஐப் பயன்படுத்த உங்களை வரவேற்கிறோம். இணையதளத்தைச் சட்டப்படி பயன்படுத்தி, பிறரின் உரிமைகளை மதிக்குமாறு கேட்டுக்கொள்கிறோம்."],
  ["Please do not attempt to gain unauthorised access, introduce harmful software, or interfere with the website’s operation.", "请勿试图未经授权访问、植入有害软件或干扰网站的运作。", "Sila jangan cuba mendapatkan akses tanpa kebenaran, memasukkan perisian berbahaya, atau mengganggu operasi laman web.", "அனுமதியற்ற அணுகலைப் பெறவோ, தீங்கிழைக்கும் மென்பொருளைச் செலுத்தவோ, இணையதளத்தின் செயல்பாட்டில் தலையிடவோ முயற்சிக்க வேண்டாம்."],
  ["We aim to provide helpful and accurate museum information. However, exhibit details, opening hours, admission prices, and available services may change. Please check directly with the museum when planning your visit.", "我们力求提供实用且准确的博物馆信息。不过，展品详情、开放时间、门票价格和所提供的服务可能会有变动。规划参观时请直接向博物馆确认。", "Kami berusaha menyediakan maklumat muzium yang berguna dan tepat. Walau bagaimanapun, butiran pameran, waktu operasi, harga kemasukan dan perkhidmatan yang tersedia mungkin berubah. Sila semak terus dengan muzium semasa merancang lawatan anda.", "பயனுள்ள, துல்லியமான அருங்காட்சியகத் தகவல்களை வழங்க முயல்கிறோம். இருப்பினும் காட்சிப் பொருள் விவரங்கள், திறக்கும் நேரம், நுழைவுக் கட்டணம், கிடைக்கும் சேவைகள் மாறக்கூடும். வருகையைத் திட்டமிடும்போது அருங்காட்சியகத்திடம் நேரடியாகச் சரிபார்க்கவும்."],
  ["During your visit, please follow the museum’s rules, posted notices, and staff guidance. Information on MINTH does not replace these instructions.", "参观期间，请遵守博物馆的规定、张贴的告示和工作人员的指引。MINTH 上的信息不能取代这些指示。", "Semasa lawatan anda, sila patuhi peraturan muzium, notis yang dipaparkan dan panduan kakitangan. Maklumat di MINTH tidak menggantikan arahan ini.", "உங்கள் வருகையின்போது அருங்காட்சியக விதிகள், ஒட்டப்பட்ட அறிவிப்புகள், பணியாளர் வழிகாட்டுதலைப் பின்பற்றுங்கள். MINTH இல் உள்ள தகவல் இந்த அறிவுறுத்தல்களுக்கு மாற்று அல்ல."],
  ["Our relationship with the museum:", "我们与博物馆的关系：", "Hubungan kami dengan muzium:", "அருங்காட்சியகத்துடனான எங்கள் உறவு:"],
  ["MINTH is a student prototype made for a competition. It is not an official service of the MINT Museum of Toys, and the museum does not operate it. Museum facts shown here come from the museum’s public information.", "MINTH 是为比赛制作的学生原型作品。它不是 MINT 玩具博物馆的官方服务，也不由博物馆运营。这里显示的博物馆资料来自博物馆的公开信息。", "MINTH ialah prototaip pelajar yang dibuat untuk satu pertandingan. Ia bukan perkhidmatan rasmi MINT Museum of Toys, dan muzium tidak mengendalikannya. Fakta muzium yang ditunjukkan di sini diperoleh daripada maklumat awam muzium.", "MINTH என்பது ஒரு போட்டிக்காக உருவாக்கப்பட்ட மாணவர் முன்மாதிரி. இது MINT பொம்மை அருங்காட்சியகத்தின் அதிகாரப்பூர்வ சேவை அல்ல; அருங்காட்சியகம் இதை இயக்கவில்லை. இங்கு காட்டப்படும் அருங்காட்சியகத் தகவல்கள் அதன் பொதுத் தகவல்களிலிருந்து பெறப்பட்டவை."],
  ["The text, illustrations, designs, and other materials on MINTH belong to us or their respective rights holders, unless otherwise stated.", "除非另有说明，MINTH 上的文字、插图、设计及其他材料归我们或各自的权利人所有。", "Teks, ilustrasi, reka bentuk dan bahan lain di MINTH adalah milik kami atau pemegang hak masing-masing, melainkan dinyatakan sebaliknya.", "வேறுவிதமாகக் குறிப்பிடப்படாவிட்டால், MINTH இல் உள்ள உரை, விளக்கப்படங்கள், வடிவமைப்புகள் மற்றும் பிற பொருள்கள் எங்களுக்கோ அவற்றின் உரிமையாளர்களுக்கோ சொந்தமானவை."],
  ["You are welcome to view this content for personal, non-commercial use. If you would like to copy, adapt, publish, or use it commercially, please obtain permission from the relevant rights holder, except where the law permits such use.", "欢迎你出于个人、非商业用途浏览这些内容。如需复制、改编、发布或作商业用途，请先取得相关权利人的许可，法律允许的情况除外。", "Anda dialu-alukan untuk melihat kandungan ini bagi kegunaan peribadi dan bukan komersial. Jika anda ingin menyalin, mengubah suai, menerbitkan atau menggunakannya secara komersial, sila dapatkan kebenaran daripada pemegang hak yang berkenaan, kecuali jika undang-undang membenarkan penggunaan tersebut.", "தனிப்பட்ட, வணிகம் சாராத பயன்பாட்டிற்காக இந்த உள்ளடக்கத்தைப் பார்க்கலாம். இதை நகலெடுக்க, மாற்றியமைக்க, வெளியிட அல்லது வணிக ரீதியாகப் பயன்படுத்த விரும்பினால், சட்டம் அனுமதிக்கும் இடங்களைத் தவிர, தொடர்புடைய உரிமையாளரிடம் அனுமதி பெறுங்கள்."],
  ["Museum names, logos, trademarks, and third-party images remain the property of their respective owners. Their appearance on MINTH does not automatically indicate endorsement or grant permission to use them.", "博物馆名称、标志、商标和第三方图片仍属其各自所有者。它们出现在 MINTH 上，并不自动表示获得认可，也不代表授予使用许可。", "Nama muzium, logo, tanda dagangan dan imej pihak ketiga kekal sebagai hak milik pemilik masing-masing. Kemunculannya di MINTH tidak secara automatik menunjukkan sokongan atau memberi kebenaran untuk menggunakannya.", "அருங்காட்சியகப் பெயர்கள், சின்னங்கள், வர்த்தக முத்திரைகள், மூன்றாம் தரப்புப் படங்கள் அவற்றின் உரிமையாளர்களின் சொத்தாகவே இருக்கும். அவை MINTH இல் இடம்பெறுவது தானாகவே ஒப்புதலையோ பயன்படுத்தும் அனுமதியையோ குறிக்காது."],
  ["For your convenience, MINTH may include links to museum websites, ticketing platforms, or other external services.", "为方便你使用，MINTH 可能包含通往博物馆网站、票务平台或其他外部服务的链接。", "Untuk kemudahan anda, MINTH mungkin mengandungi pautan ke laman web muzium, platform tiket atau perkhidmatan luar yang lain.", "உங்கள் வசதிக்காக, அருங்காட்சியக இணையதளங்கள், சீட்டு விற்பனைத் தளங்கள் அல்லது பிற வெளிச் சேவைகளுக்கான இணைப்புகளை MINTH கொண்டிருக்கலாம்."],
  ["These websites operate independently and have their own terms and privacy policies. Please review those policies before using their services or sharing personal information. We do not control their content or practices.", "这些网站独立运作，并有各自的条款和隐私政策。在使用其服务或分享个人信息前，请先查阅这些政策。我们无法控制其内容或做法。", "Laman web ini beroperasi secara bebas dan mempunyai terma serta dasar privasi sendiri. Sila semak dasar tersebut sebelum menggunakan perkhidmatan mereka atau berkongsi maklumat peribadi. Kami tidak mengawal kandungan atau amalan mereka.", "இந்த இணையதளங்கள் தனித்து இயங்குகின்றன; அவற்றுக்கெனத் தனி விதிமுறைகளும் தனியுரிமைக் கொள்கைகளும் உள்ளன. அவற்றின் சேவைகளைப் பயன்படுத்தும் முன் அல்லது தனிப்பட்ட தகவலைப் பகிரும் முன் அந்தக் கொள்கைகளைப் படியுங்கள். அவற்றின் உள்ளடக்கத்தையோ நடைமுறைகளையோ நாங்கள் கட்டுப்படுத்துவதில்லை."],
  ["Information on MINTH does not constitute a ticket, reservation, or guarantee of admission.", "MINTH 上的信息不构成门票、预订或入场保证。", "Maklumat di MINTH bukan tiket, tempahan atau jaminan kemasukan.", "MINTH இல் உள்ள தகவல் நுழைவுச்சீட்டோ, முன்பதிவோ, நுழைவு உத்தரவாதமோ அல்ல."],
  ["If you purchase tickets or make bookings through an external provider, that provider’s terms will apply, including its payment, cancellation, and refund policies.", "如果你通过外部服务商购票或预订，将适用该服务商的条款，包括其付款、取消和退款政策。", "Jika anda membeli tiket atau membuat tempahan melalui penyedia luar, terma penyedia itu akan terpakai, termasuk dasar pembayaran, pembatalan dan bayaran baliknya.", "வெளிச் சேவை வழங்குநர் மூலம் சீட்டு வாங்கினாலோ முன்பதிவு செய்தாலோ, அவர்களின் கட்டணம், ரத்து, பணத்திருப்பக் கொள்கைகள் உள்ளிட்ட விதிமுறைகளே பொருந்தும்."],
  ["Please read our", "请阅读我们的", "Sila baca", "எங்கள்"],
  ["Acceptance of these terms does not provide blanket consent to collect or use your personal information. We will provide notices and obtain consent where required by applicable law.", "接受这些条款并不表示你笼统同意我们收集或使用你的个人信息。我们会按适用法律的要求发出通知并取得同意。", "Penerimaan terma ini tidak memberikan persetujuan menyeluruh untuk mengumpul atau menggunakan maklumat peribadi anda. Kami akan memberi notis dan mendapatkan persetujuan apabila dikehendaki oleh undang-undang yang terpakai.", "இந்த விதிமுறைகளை ஏற்பது உங்கள் தனிப்பட்ட தகவலைச் சேகரிக்கவோ பயன்படுத்தவோ முழு ஒப்புதல் அளிப்பதாகாது. பொருந்தும் சட்டம் கோரும் இடங்களில் அறிவிப்புகளை வழங்கி ஒப்புதல் பெறுவோம்."],
  ["We take reasonable care in maintaining MINTH and aim to provide a smooth browsing experience. However, we cannot guarantee that the website will always be available, error-free, or uninterrupted.", "我们会合理谨慎地维护 MINTH，力求提供顺畅的浏览体验。但我们无法保证网站始终可用、毫无错误或不会中断。", "Kami mengambil langkah yang munasabah dalam menyelenggara MINTH dan berusaha menyediakan pengalaman melayari yang lancar. Walau bagaimanapun, kami tidak dapat menjamin bahawa laman web ini sentiasa tersedia, bebas ralat atau tanpa gangguan.", "MINTH ஐப் பராமரிப்பதில் நியாயமான கவனம் செலுத்தி, சீரான உலாவல் அனுபவத்தை வழங்க முயல்கிறோம். இருப்பினும் இணையதளம் எப்போதும் கிடைக்கும், பிழையின்றி இருக்கும் அல்லது தடையின்றி இயங்கும் என உத்தரவாதம் அளிக்க முடியாது."],
  ["To the extent permitted by law, MINTH is provided on an “as available” basis without guarantees about the completeness, accuracy, or suitability of its content for a particular purpose.", "在法律允许的范围内，MINTH 按“现有状况”提供，不保证其内容的完整性、准确性或对特定用途的适用性。", "Setakat yang dibenarkan oleh undang-undang, MINTH disediakan atas dasar “seperti yang tersedia” tanpa jaminan tentang kelengkapan, ketepatan atau kesesuaian kandungannya untuk tujuan tertentu.", "சட்டம் அனுமதிக்கும் அளவிற்கு, MINTH “கிடைக்கும் நிலையில்” வழங்கப்படுகிறது; அதன் உள்ளடக்கத்தின் முழுமை, துல்லியம் அல்லது குறிப்பிட்ட நோக்கத்திற்கான பொருத்தம் குறித்து உத்தரவாதம் இல்லை."],
  ["To the extent permitted by applicable law, we will not be liable for indirect or consequential losses arising from your use of, or inability to use, MINTH.", "在适用法律允许的范围内，对于因你使用或无法使用 MINTH 而产生的间接或后果性损失，我们不承担责任。", "Setakat yang dibenarkan oleh undang-undang yang terpakai, kami tidak akan bertanggungjawab atas kerugian tidak langsung atau berbangkit yang timbul daripada penggunaan, atau ketidakupayaan anda menggunakan, MINTH.", "பொருந்தும் சட்டம் அனுமதிக்கும் அளவிற்கு, MINTH ஐப் பயன்படுத்துவதாலோ பயன்படுத்த இயலாமையாலோ ஏற்படும் மறைமுக அல்லது விளைவு இழப்புகளுக்கு நாங்கள் பொறுப்பல்ல."],
  ["Nothing in these terms excludes or limits liability for fraud, death or personal injury caused by negligence, or any liability that cannot legally be excluded or limited. Any limitation applies only where lawful and subject to applicable requirements of reasonableness.", "这些条款的任何内容均不排除或限制因欺诈、疏忽导致的死亡或人身伤害所产生的责任，或依法不得排除或限制的任何责任。任何限制仅在合法且符合适用的合理性要求时适用。", "Tiada apa-apa dalam terma ini yang mengecualikan atau mengehadkan liabiliti bagi penipuan, kematian atau kecederaan diri akibat kecuaian, atau sebarang liabiliti yang tidak boleh dikecualikan atau dihadkan di sisi undang-undang. Sebarang had hanya terpakai jika sah dan tertakluk kepada keperluan kemunasabahan yang terpakai.", "மோசடி, அலட்சியத்தால் ஏற்படும் மரணம் அல்லது உடல் காயம், அல்லது சட்டப்படி விலக்கவோ வரம்பிடவோ முடியாத எந்தப் பொறுப்பையும் இந்த விதிமுறைகள் விலக்கவோ வரம்பிடவோ இல்லை. எந்த வரம்பும் சட்டப்பூர்வமான இடங்களிலும், பொருந்தும் நியாயத்தன்மைத் தேவைகளுக்கு உட்பட்டும் மட்டுமே பொருந்தும்."],
  ["We may occasionally update the website and these terms to reflect changes to our services or legal requirements.", "我们可能不时更新网站和这些条款，以反映服务或法律要求的变化。", "Kami mungkin mengemas kini laman web dan terma ini dari semasa ke semasa untuk mencerminkan perubahan pada perkhidmatan kami atau keperluan undang-undang.", "எங்கள் சேவைகள் அல்லது சட்டத் தேவைகளில் ஏற்படும் மாற்றங்களைப் பிரதிபலிக்க, இணையதளத்தையும் இந்த விதிமுறைகளையும் அவ்வப்போது புதுப்பிக்கலாம்."],
  ["Updated terms will appear on this page with a revised date and will apply from that date onward. We will provide reasonable notice of significant changes affecting your rights or obligations, and obtain consent where legally required.", "更新后的条款会连同修订日期显示在本页，并自该日期起生效。对于影响你权利或义务的重大变更，我们会给予合理通知，并在法律要求时取得同意。", "Terma yang dikemas kini akan dipaparkan di halaman ini dengan tarikh semakan dan akan terpakai mulai tarikh tersebut. Kami akan memberi notis yang munasabah tentang perubahan ketara yang menjejaskan hak atau kewajipan anda, dan mendapatkan persetujuan apabila dikehendaki oleh undang-undang.", "புதுப்பிக்கப்பட்ட விதிமுறைகள் திருத்தப்பட்ட தேதியுடன் இந்தப் பக்கத்தில் தோன்றும்; அந்தத் தேதியிலிருந்து அவை பொருந்தும். உங்கள் உரிமைகளையோ கடமைகளையோ பாதிக்கும் முக்கிய மாற்றங்கள் குறித்து நியாயமான அறிவிப்பை வழங்கி, சட்டப்படி தேவைப்படும் இடங்களில் ஒப்புதல் பெறுவோம்."],
  ["We may temporarily restrict access where reasonably necessary for maintenance, security, legal compliance, or to address misuse. Where practical, we will provide notice of planned interruptions.", "为了维护、安全、遵守法律或处理滥用情况，我们可能在合理必要时暂时限制访问。在可行的情况下，我们会就计划中的中断提前通知。", "Kami mungkin mengehadkan akses buat sementara waktu apabila perlu secara munasabah untuk penyelenggaraan, keselamatan, pematuhan undang-undang, atau untuk menangani penyalahgunaan. Jika praktikal, kami akan memberi notis tentang gangguan yang dirancang.", "பராமரிப்பு, பாதுகாப்பு, சட்ட இணக்கம் அல்லது தவறான பயன்பாட்டைக் கையாள நியாயமாகத் தேவைப்படும்போது அணுகலைத் தற்காலிகமாகக் கட்டுப்படுத்தலாம். இயன்ற இடங்களில், திட்டமிட்ட இடையூறுகள் குறித்து முன்னறிவிப்பு வழங்குவோம்."],
  ["Some features may have additional terms, which will be presented before you use them. If there is a conflict, those specific terms will apply to the relevant feature.", "部分功能可能有附加条款，会在你使用前向你展示。如有冲突，相关功能以这些特定条款为准。", "Sesetengah ciri mungkin mempunyai terma tambahan, yang akan dipaparkan sebelum anda menggunakannya. Jika terdapat percanggahan, terma khusus tersebut akan terpakai bagi ciri yang berkenaan.", "சில அம்சங்களுக்குக் கூடுதல் விதிமுறைகள் இருக்கலாம்; அவற்றைப் பயன்படுத்தும் முன் அவை காட்டப்படும். முரண்பாடு இருந்தால், தொடர்புடைய அம்சத்திற்கு அந்தக் குறிப்பிட்ட விதிமுறைகளே பொருந்தும்."],
  ["If a provision is found to be invalid or unenforceable, it will be set aside only to the extent necessary. The remaining terms will continue to apply.", "如果某项条款被认定为无效或无法执行，仅在必要范围内不予适用。其余条款继续有效。", "Jika sesuatu peruntukan didapati tidak sah atau tidak boleh dikuatkuasakan, ia akan diketepikan hanya setakat yang perlu. Terma yang selebihnya akan terus terpakai.", "ஏதேனும் ஒரு விதி செல்லாதது அல்லது செயல்படுத்த முடியாதது எனக் கண்டறியப்பட்டால், தேவையான அளவிற்கு மட்டுமே அது விலக்கப்படும். மீதமுள்ள விதிமுறைகள் தொடர்ந்து பொருந்தும்."],
  ["These terms are governed by the laws of the Republic of Singapore. Subject to any mandatory legal rights, disputes relating to these terms or the use of MINTH will be subject to the exclusive jurisdiction of the courts of Singapore.", "这些条款受新加坡共和国法律管辖。在不影响任何强制性法定权利的前提下，与这些条款或使用 MINTH 有关的争议由新加坡法院专属管辖。", "Terma ini tertakluk kepada undang-undang Republik Singapura. Tertakluk kepada mana-mana hak undang-undang mandatori, pertikaian berkaitan terma ini atau penggunaan MINTH akan tertakluk kepada bidang kuasa eksklusif mahkamah Singapura.", "இந்த விதிமுறைகள் சிங்கப்பூர் குடியரசின் சட்டங்களால் நிர்வகிக்கப்படுகின்றன. கட்டாயச் சட்ட உரிமைகளுக்கு உட்பட்டு, இந்த விதிமுறைகள் அல்லது MINTH பயன்பாடு தொடர்பான சர்ச்சைகள் சிங்கப்பூர் நீதிமன்றங்களின் பிரத்தியேக அதிகார வரம்பிற்கு உட்பட்டவை."],
  ["If you have questions about these terms, please contact us. We welcome the opportunity to help.", "如果你对这些条款有任何疑问，请联系我们。我们很乐意提供帮助。", "Jika anda mempunyai soalan tentang terma ini, sila hubungi kami. Kami berbesar hati untuk membantu.", "இந்த விதிமுறைகள் குறித்து கேள்விகள் இருந்தால், எங்களைத் தொடர்புகொள்ளுங்கள். உதவ நாங்கள் மகிழ்ச்சியடைகிறோம்."],

  // ---------- rewards, chatbot, contact, privacy and terms (second pass) ----------
  ["READY FOR YOUR NEXT ADVENTURE", "准备好迎接下一次探险", "SEDIA UNTUK PENGEMBARAAN SETERUSNYA", "உங்கள் அடுத்த சாகசத்திற்குத் தயார்"],
  ["Small children’s gift", "儿童小礼物", "Hadiah kecil untuk kanak-kanak", "குழந்தைகளுக்கான சிறு பரிசு"],
  ["Choose a small surprise such as stickers, a pencil, or a mini activity kit.", "选择一份小惊喜，例如贴纸、铅笔或迷你活动包。", "Pilih kejutan kecil seperti pelekat, pensel atau kit aktiviti mini.", "ஸ்டிக்கர், பென்சில் அல்லது சிறு செயல்பாட்டுத் தொகுப்பு போன்ற ஒரு சிறு ஆச்சரியப் பரிசைத் தேர்ந்தெடுங்கள்."],
  ["20% off one museum admission ticket", "一张博物馆门票八折优惠", "Diskaun 20% untuk satu tiket masuk muzium", "ஒரு அருங்காட்சியக நுழைவுச்சீட்டுக்கு 20% தள்ளுபடி"],
  ["A proposed demo discount for one museum admission ticket.", "一张博物馆门票的演示折扣提案。", "Cadangan diskaun demo untuk satu tiket masuk muzium.", "ஒரு அருங்காட்சியக நுழைவுச்சீட்டுக்கான டெமோ தள்ளுபடி முன்மொழிவு."],
  ["S$5 FairPrice voucher (demo proposal)", "5 新元 FairPrice 优惠券（演示提案）", "Baucar FairPrice S$5 (cadangan demo)", "S$5 FairPrice வவுச்சர் (டெமோ முன்மொழிவு)"],
  ["A proposed demo reward only; this is not an issued voucher or an official FairPrice partnership.", "仅为演示奖励提案；这不是已发行的优惠券，也不代表与 FairPrice 官方合作。", "Cadangan ganjaran demo sahaja; ini bukan baucar yang dikeluarkan atau kerjasama rasmi FairPrice.", "இது டெமோ வெகுமதி முன்மொழிவு மட்டுமே; வழங்கப்பட்ட வவுச்சரோ FairPrice அதிகாரப்பூர்வ கூட்டாண்மையோ அல்ல."],
  ["No rewards yet. Choose one above when you’re ready!", "还没有奖励。准备好后在上方选择一个吧！", "Belum ada ganjaran. Pilih satu di atas apabila anda bersedia!", "இன்னும் வெகுமதிகள் இல்லை. தயாரானதும் மேலே ஒன்றைத் தேர்ந்தெடுங்கள்!"],
  ["In a live service, only authorised staff can mark a reward as used. No visitor-side status controls are available in this demo.", "正式服务中，只有获授权的工作人员可以将奖励标记为已使用。本演示不提供访客端状态控制。", "Dalam perkhidmatan sebenar, hanya kakitangan yang diberi kuasa boleh menandakan ganjaran sebagai telah digunakan. Tiada kawalan status di pihak pelawat dalam demo ini.", "உண்மையான சேவையில், அங்கீகரிக்கப்பட்ட பணியாளர்கள் மட்டுமே ஒரு வெகுமதியைப் பயன்படுத்தியதாகக் குறிக்க முடியும். இந்த டெமோவில் பார்வையாளர் பக்க நிலைக் கட்டுப்பாடுகள் இல்லை."],
  ["Complete all three Toy Time Machine missions to earn 20 points.", "完成玩具时光机的全部三个任务即可获得 20 分。", "Selesaikan ketiga-tiga misi Mesin Masa Mainan untuk memperoleh 20 mata.", "20 புள்ளிகள் பெற பொம்மை கால இயந்திரத்தின் மூன்று பணிகளையும் நிறைவு செய்யுங்கள்."],
  ["Mission stamps", "任务印章", "Cop misi", "பணி முத்திரைகள்"],
  ["I can answer questions about MINT. I may not know everything. For other help, ask a staff member.", "我可以回答有关 MINT 的问题，但不一定无所不知。如需其他帮助，请咨询工作人员。", "Saya boleh menjawab soalan tentang MINT. Saya mungkin tidak tahu semuanya. Untuk bantuan lain, tanya kakitangan.", "MINT பற்றிய கேள்விகளுக்கு நான் பதிலளிக்க முடியும். எனக்கு எல்லாம் தெரிந்திருக்காது. பிற உதவிக்குப் பணியாளரிடம் கேளுங்கள்."],
  ["Have a question about your visit? We'd love to hear from you.", "对参观有疑问吗？欢迎与我们联系。", "Ada soalan tentang lawatan anda? Kami ingin mendengar daripada anda.", "உங்கள் வருகை குறித்து கேள்வி உள்ளதா? உங்களிடமிருந்து கேட்க ஆவலாக உள்ளோம்."],
  ["Opens your email app with your message ready to send.", "将打开你的电邮应用，信息已准备好发送。", "Aplikasi e-mel anda akan dibuka dengan mesej yang sedia dihantar.", "அனுப்பத் தயாரான செய்தியுடன் உங்கள் மின்னஞ்சல் செயலி திறக்கும்."],
  ["(opens in a new tab)", "（在新标签页打开）", "(dibuka dalam tab baharu)", "(புதிய தாவலில் திறக்கும்)"],
  ["Request access to personal information we hold about you and information about how it has been used or disclosed, subject to applicable law.", "在适用法律允许的范围内，申请查阅我们持有的你的个人信息，以及这些信息如何被使用或披露。", "Memohon akses kepada maklumat peribadi yang kami simpan tentang anda dan maklumat tentang cara ia digunakan atau didedahkan, tertakluk kepada undang-undang yang terpakai.", "பொருந்தும் சட்டத்திற்கு உட்பட்டு, உங்களைப் பற்றி நாங்கள் வைத்திருக்கும் தனிப்பட்ட தகவலையும், அது எவ்வாறு பயன்படுத்தப்பட்டது அல்லது வெளியிடப்பட்டது என்ற தகவலையும் அணுகக் கோரலாம்."],
  ["Withdraw consent to future collection, use, or disclosure where processing relies on your consent.", "在处理以你的同意为依据的情况下，撤回对今后收集、使用或披露的同意。", "Menarik balik persetujuan untuk pengumpulan, penggunaan atau pendedahan pada masa hadapan apabila pemprosesan bergantung pada persetujuan anda.", "உங்கள் ஒப்புதலை அடிப்படையாகக் கொண்ட செயலாக்கத்தில், எதிர்காலச் சேகரிப்பு, பயன்பாடு அல்லது வெளியீட்டிற்கான ஒப்புதலைத் திரும்பப் பெறலாம்."],
  ["Ask questions or raise a concern about our privacy practices.", "就我们的隐私做法提出问题或疑虑。", "Bertanya soalan atau menyuarakan kebimbangan tentang amalan privasi kami.", "எங்கள் தனியுரிமை நடைமுறைகள் குறித்து கேள்வி கேட்கலாம் அல்லது கவலையைத் தெரிவிக்கலாம்."],
  ["We will respond in accordance with applicable legal requirements. We may need to verify your identity before acting on a request.", "我们会按照适用的法律要求作出回应。在处理请求前，我们可能需要核实你的身份。", "Kami akan memberi maklum balas mengikut keperluan undang-undang yang terpakai. Kami mungkin perlu mengesahkan identiti anda sebelum bertindak atas sesuatu permintaan.", "பொருந்தும் சட்டத் தேவைகளின்படி பதிலளிப்போம். ஒரு கோரிக்கையின் மீது நடவடிக்கை எடுக்கும் முன் உங்கள் அடையாளத்தைச் சரிபார்க்க வேண்டியிருக்கலாம்."],
  ["If withdrawing consent affects our ability to provide a particular feature, we will explain the consequences. Withdrawal does not affect processing already carried out or processing permitted or required by law.", "如果撤回同意会影响我们提供某项功能，我们会说明后果。撤回同意不影响已经进行的处理，也不影响法律允许或要求的处理。", "Jika penarikan persetujuan menjejaskan keupayaan kami untuk menyediakan ciri tertentu, kami akan menerangkan akibatnya. Penarikan tidak menjejaskan pemprosesan yang telah dijalankan atau pemprosesan yang dibenarkan atau dikehendaki oleh undang-undang.", "ஒப்புதலைத் திரும்பப் பெறுவது ஒரு குறிப்பிட்ட அம்சத்தை வழங்கும் எங்கள் திறனைப் பாதித்தால், அதன் விளைவுகளை விளக்குவோம். ஏற்கெனவே நடந்த செயலாக்கத்தையோ சட்டம் அனுமதிக்கும் அல்லது கோரும் செயலாக்கத்தையோ இது பாதிக்காது."],
  ["We encourage younger visitors to involve a parent or guardian before submitting personal information through MINTH.", "我们鼓励年轻访客在通过 MINTH 提交个人信息前，先咨询父母或监护人。", "Kami menggalakkan pelawat muda melibatkan ibu bapa atau penjaga sebelum menghantar maklumat peribadi melalui MINTH.", "MINTH மூலம் தனிப்பட்ட தகவலைச் சமர்ப்பிக்கும் முன், இளம் பார்வையாளர்கள் பெற்றோர் அல்லது பாதுகாவலரை ஈடுபடுத்துமாறு ஊக்குவிக்கிறோம்."],
  ["If you believe a child has provided information that should not have been collected, please contact us so we can review and address the situation.", "如果你认为有儿童提供了不应被收集的信息，请联系我们，以便我们查核并处理。", "Jika anda percaya seorang kanak-kanak telah memberikan maklumat yang tidak sepatutnya dikumpul, sila hubungi kami supaya kami dapat menyemak dan menangani perkara itu.", "சேகரிக்கப்படக் கூடாத தகவலை ஒரு குழந்தை வழங்கியதாக நீங்கள் நம்பினால், நாங்கள் அதை ஆய்வு செய்து சரிசெய்ய எங்களைத் தொடர்புகொள்ளுங்கள்."],
  ["MINTH may contain links to websites operated by museums, ticketing providers, or other organisations. This Privacy Policy applies only to MINTH.", "MINTH 可能包含博物馆、票务服务商或其他机构运营网站的链接。本隐私政策仅适用于 MINTH。", "MINTH mungkin mengandungi pautan ke laman web yang dikendalikan oleh muzium, penyedia tiket atau organisasi lain. Dasar Privasi ini hanya terpakai kepada MINTH.", "அருங்காட்சியகங்கள், சீட்டு வழங்குநர்கள் அல்லது பிற நிறுவனங்கள் இயக்கும் இணையதளங்களுக்கான இணைப்புகளை MINTH கொண்டிருக்கலாம். இந்தத் தனியுரிமைக் கொள்கை MINTH க்கு மட்டுமே பொருந்தும்."],
  ["Please review the privacy policy of an external website before sharing information with it.", "在向外部网站分享信息前，请先查阅该网站的隐私政策。", "Sila semak dasar privasi laman web luaran sebelum berkongsi maklumat dengannya.", "வெளி இணையதளத்துடன் தகவலைப் பகிரும் முன் அதன் தனியுரிமைக் கொள்கையைப் படியுங்கள்."],
  ["We may update this Privacy Policy as our website or data practices change. The latest version will be available on this page with an updated date.", "随着网站或数据处理方式的变化，我们可能更新本隐私政策。最新版本会连同更新日期显示在本页。", "Kami mungkin mengemas kini Dasar Privasi ini apabila laman web atau amalan data kami berubah. Versi terkini akan tersedia di halaman ini dengan tarikh yang dikemas kini.", "எங்கள் இணையதளம் அல்லது தரவு நடைமுறைகள் மாறும்போது இந்தத் தனியுரிமைக் கொள்கையைப் புதுப்பிக்கலாம். சமீபத்திய பதிப்பு புதுப்பிக்கப்பட்ட தேதியுடன் இந்தப் பக்கத்தில் கிடைக்கும்."],
  ["Where changes involve new uses of personal information, we will provide notice and obtain further consent where required by law.", "如果变更涉及个人信息的新用途，我们会发出通知，并在法律要求时另行取得同意。", "Jika perubahan melibatkan penggunaan baharu maklumat peribadi, kami akan memberi notis dan mendapatkan persetujuan lanjut apabila dikehendaki oleh undang-undang.", "மாற்றங்கள் தனிப்பட்ட தகவலின் புதிய பயன்பாடுகளை உள்ளடக்கினால், அறிவிப்பு வழங்கி, சட்டம் கோரும் இடங்களில் மேலும் ஒப்புதல் பெறுவோம்."],
  ["If you have questions, requests, or concerns about your personal information, please contact our privacy representative.", "如果你对个人信息有任何疑问、请求或顾虑，请联系我们的隐私事务负责人。", "Jika anda mempunyai soalan, permintaan atau kebimbangan tentang maklumat peribadi anda, sila hubungi wakil privasi kami.", "உங்கள் தனிப்பட்ட தகவல் குறித்து கேள்விகள், கோரிக்கைகள் அல்லது கவலைகள் இருந்தால், எங்கள் தனியுரிமைப் பிரதிநிதியைத் தொடர்புகொள்ளுங்கள்."],
  ["Last updated:", "最后更新：", "Kemas kini terakhir:", "கடைசியாகப் புதுப்பிக்கப்பட்டது:"],
  ["Welcome to MINTH. We hope our museum guide helps you enjoy discovering the stories behind the exhibits.", "欢迎来到 MINTH。希望本博物馆指南能帮助你探索展品背后的故事，享受参观体验。", "Selamat datang ke MINTH. Kami harap panduan muzium kami membantu anda menikmati penerokaan kisah di sebalik pameran.", "MINTH க்கு வரவேற்கிறோம். காட்சிப் பொருள்களுக்குப் பின்னால் உள்ள கதைகளைக் கண்டறிந்து மகிழ எங்கள் அருங்காட்சியக வழிகாட்டி உதவும் என நம்புகிறோம்."],
  ["1. Using MINTH", "1. 使用 MINTH", "1. Menggunakan MINTH", "1. MINTH ஐப் பயன்படுத்துதல்"],
  ["2. Your Museum Guide", "2. 你的博物馆指南", "2. Panduan Muzium Anda", "2. உங்கள் அருங்காட்சியக வழிகாட்டி"],
  ["3. Content, Images, and Trademarks", "3. 内容、图片与商标", "3. Kandungan, Imej dan Tanda Dagangan", "3. உள்ளடக்கம், படங்கள் மற்றும் வர்த்தக முத்திரைகள்"],
  ["4. Links to Other Websites", "4. 其他网站的链接", "4. Pautan ke Laman Web Lain", "4. பிற இணையதளங்களுக்கான இணைப்புகள்"],
  ["5. Tickets and Bookings", "5. 门票与预订", "5. Tiket dan Tempahan", "5. சீட்டுகள் மற்றும் முன்பதிவுகள்"],
  ["6. Your Privacy", "6. 你的隐私", "6. Privasi Anda", "6. உங்கள் தனியுரிமை"],
  ["to learn how personal information is handled when you use MINTH.", "，了解你使用 MINTH 时个人信息如何被处理。", "untuk mengetahui cara maklumat peribadi dikendalikan apabila anda menggunakan MINTH.", "ஐப் படித்து, MINTH ஐப் பயன்படுத்தும்போது தனிப்பட்ட தகவல் எவ்வாறு கையாளப்படுகிறது என்பதை அறியுங்கள்."],
  ["7. Website Availability", "7. 网站可用性", "7. Ketersediaan Laman Web", "7. இணையதளக் கிடைப்புநிலை"],
  ["8. Our Responsibility", "8. 我们的责任", "8. Tanggungjawab Kami", "8. எங்கள் பொறுப்பு"],
  ["9. Updates to MINTH and These Terms", "9. MINTH 和本条款的更新", "9. Kemas Kini kepada MINTH dan Terma Ini", "9. MINTH மற்றும் இந்த விதிமுறைகளுக்கான புதுப்பிப்புகள்"],
  ["10. Protecting the Website", "10. 保护网站", "10. Melindungi Laman Web", "10. இணையதளத்தைப் பாதுகாத்தல்"],
  ["11. Additional Terms", "11. 附加条款", "11. Terma Tambahan", "11. கூடுதல் விதிமுறைகள்"],
  ["12. If Part of These Terms Cannot Apply", "12. 如果部分条款无法适用", "12. Jika Sebahagian Terma Ini Tidak Boleh Terpakai", "12. இந்த விதிமுறைகளின் ஒரு பகுதி பொருந்தாவிட்டால்"],
  ["13. Governing Law", "13. 适用法律", "13. Undang-undang yang Mentadbir", "13. நிர்வகிக்கும் சட்டம்"],
  ["14. Contact Us", "14. 联系我们", "14. Hubungi Kami", "14. எங்களைத் தொடர்புகொள்ளுங்கள்"],
  ["Email:", "电邮：", "E-mel:", "மின்னஞ்சல்:"],
  ["Phone:", "电话：", "Telefon:", "தொலைபேசி:"],
  ["Address:", "地址：", "Alamat:", "முகவரி:"],
];

const column = (index: 1 | 2 | 3): Dictionary => Object.fromEntries(ROWS.map((row) => [row[0], row[index]]));

export const zhAuto = column(1);
export const msAuto = column(2);
export const taAuto = column(3);

// ---------- text with a changing part ----------

type Language = Exclude<ChatLanguage, 'en'>;
/** Translates a smaller piece of the text, such as a place name inside a sentence. */
type Part = (text: string) => string;
type Template = (match: RegExpMatchArray, part: Part) => string;

/** Joins a list of places the way each language writes "a, b and c". */
const joinList = (items: string[], language: Language): string => {
  if (language === 'zh') return items.join('、');
  if (items.length <= 1) return items[0] ?? '';
  const last = items[items.length - 1];
  const rest = items.slice(0, -1).join(', ');
  return language === 'ms' ? `${rest} dan ${last}` : `${rest}, ${last}`;
};

const splitList = (text: string): string[] => text.split(/, | and /).filter(Boolean);

const PATTERNS: readonly (readonly [RegExp, Record<Language, Template>])[] = [
  [/^Level (\d+)$/, {
    zh: (m) => `${m[1]} 楼`,
    ms: (m) => `Aras ${m[1]}`,
    ta: (m) => `நிலை ${m[1]}`,
  }],
  [/^Toy Collection display (\d+)$/, {
    zh: (m) => `玩具收藏展柜 ${m[1]}`,
    ms: (m) => `Pameran Koleksi Mainan ${m[1]}`,
    ta: (m) => `பொம்மைத் தொகுப்புக் காட்சி ${m[1]}`,
  }],
  [/^Enamel Sign Gallery, section (\d+)$/, {
    zh: (m) => `搪瓷招牌展廊 第 ${m[1]} 区`,
    ms: (m) => `Galeri Papan Tanda Enamel, bahagian ${m[1]}`,
    ta: (m) => `எனாமல் பலகைக் காட்சியகம், பகுதி ${m[1]}`,
  }],
  // "Lift, Level 2" (map labels read by screen readers)
  [/^(.+), (Level \d+|Rooftop)$/, {
    zh: (m, p) => `${p(m[1])}，${p(m[2])}`,
    ms: (m, p) => `${p(m[1])}, ${p(m[2])}`,
    ta: (m, p) => `${p(m[1])}, ${p(m[2])}`,
  }],
  // "Level 3 - near the lift" (area chosen on the Help form)
  [/^(Level \d+)( \(.+\))? - (.+)$/, {
    zh: (m, p) => `${p(m[1])}${m[2] ?? ''} - ${m[3]}`,
    ms: (m, p) => `${p(m[1])}${m[2] ?? ''} - ${m[3]}`,
    ta: (m, p) => `${p(m[1])}${m[2] ?? ''} - ${m[3]}`,
  }],
  [/^Floor plan of (.+)$/, {
    zh: (m, p) => `${p(m[1])}平面图`,
    ms: (m, p) => `Pelan lantai ${p(m[1])}`,
    ta: (m, p) => `${p(m[1])} தளவரைபடம்`,
  }],
  [/^Trail map of (.+)$/, {
    zh: (m, p) => `${p(m[1])}路线地图`,
    ms: (m, p) => `Peta jejak ${p(m[1])}`,
    ta: (m, p) => `${p(m[1])} பாதை வரைபடம்`,
  }],
  [/^(\d+) of (\d+) stamps$/, {
    zh: (m) => `${m[1]}/${m[2]} 枚印章`,
    ms: (m) => `${m[1]} daripada ${m[2]} cop`,
    ta: (m) => `${m[2]} இல் ${m[1]} முத்திரைகள்`,
  }],
  [/^(.+) · (\d+) of (\d+) spots? found$/, {
    zh: (m, p) => `${p(m[1])} · 已找到 ${m[2]}/${m[3]} 个地点`,
    ms: (m, p) => `${p(m[1])} · ${m[2]} daripada ${m[3]} lokasi ditemui`,
    ta: (m, p) => `${p(m[1])} · ${m[3]} இடங்களில் ${m[2]} கண்டறியப்பட்டது`,
  }],
  [/^(\d+) of (\d+) steps done$/, {
    zh: (m) => `已完成 ${m[1]}/${m[2]} 步`,
    ms: (m) => `${m[1]} daripada ${m[2]} langkah selesai`,
    ta: (m) => `${m[2]} படிகளில் ${m[1]} முடிந்தது`,
  }],
  [/^Step (\d+) of (\d+)$/, {
    zh: (m) => `第 ${m[1]} 步，共 ${m[2]} 步`,
    ms: (m) => `Langkah ${m[1]} daripada ${m[2]}`,
    ta: (m) => `படி ${m[1]} / ${m[2]}`,
  }],
  [/^(\d+) out of 5 stars$/, {
    zh: (m) => `${m[1]} 星（满分 5 星）`,
    ms: (m) => `${m[1]} daripada 5 bintang`,
    ta: (m) => `5 இல் ${m[1]} நட்சத்திரங்கள்`,
  }],

  // ---- directions ----
  [/^Start at (.+) on (.+)\.$/, {
    zh: (m, p) => `从${p(m[2])}的${p(m[1])}出发。`,
    ms: (m, p) => `Mulakan di ${p(m[1])}, ${p(m[2])}.`,
    ta: (m, p) => `${p(m[2])} இல் உள்ள ${p(m[1])} இலிருந்து தொடங்குங்கள்.`,
  }],
  [/^Follow the highlighted route(?: through (.+))? to (.+)\.$/, {
    zh: (m, p) => `沿着标示的路线${m[1] ? `经过${joinList(splitList(m[1]).map(p), 'zh')}` : ''}前往${p(m[2])}。`,
    ms: (m, p) => `Ikut laluan yang ditandakan${m[1] ? ` melalui ${joinList(splitList(m[1]).map(p), 'ms')}` : ''} ke ${p(m[2])}.`,
    ta: (m, p) => `குறிக்கப்பட்ட பாதையில்${m[1] ? ` ${joinList(splitList(m[1]).map(p), 'ta')} வழியாக` : ''} ${p(m[2])} வரை செல்லுங்கள்.`,
  }],
  [/^Take (the lift|the staircase) (up|down) to (.+)\.$/, {
    zh: (m, p) => `${m[1] === 'the lift' ? '乘电梯' : '走楼梯'}${m[2] === 'up' ? '上行' : '下行'}至${p(m[3])}。`,
    ms: (m, p) => `${m[2] === 'up' ? 'Naik' : 'Turun'} menggunakan ${m[1] === 'the lift' ? 'lif' : 'tangga'} ke ${p(m[3])}.`,
    ta: (m, p) => `${m[1] === 'the lift' ? 'மின்தூக்கியில்' : 'படிக்கட்டில்'} ${m[2] === 'up' ? 'மேலே' : 'கீழே'} ${p(m[3])} வரை செல்லுங்கள்.`,
  }],
  [/^You have arrived at (.+) on (.+)\.$/, {
    zh: (m, p) => `你已到达${p(m[2])}的${p(m[1])}。`,
    ms: (m, p) => `Anda telah tiba di ${p(m[1])}, ${p(m[2])}.`,
    ta: (m, p) => `${p(m[2])} இல் உள்ள ${p(m[1])} ஐ அடைந்துவிட்டீர்கள்.`,
  }],
  [/^(.+) → (.+)$/, {
    zh: (m, p) => `${p(m[1])} → ${p(m[2])}`,
    ms: (m, p) => `${p(m[1])} → ${p(m[2])}`,
    ta: (m, p) => `${p(m[1])} → ${p(m[2])}`,
  }],
  [/^Show (.+)$/, {
    zh: (m, p) => `查看${p(m[1])}`,
    ms: (m, p) => `Tunjukkan ${p(m[1])}`,
    ta: (m, p) => `${p(m[1])} ஐக் காட்டு`,
  }],
  [/^(.+) results$/, {
    zh: (m, p) => `${p(m[1])}搜索结果`,
    ms: (m, p) => `Hasil ${p(m[1])}`,
    ta: (m, p) => `${p(m[1])} முடிவுகள்`,
  }],

  // ---- discovery trail ----
  [/^(.+): stamp collected$/, {
    zh: (m, p) => `${p(m[1])}：印章已收集`,
    ms: (m, p) => `${p(m[1])}: cop telah dikumpul`,
    ta: (m, p) => `${p(m[1])}: முத்திரை சேகரிக்கப்பட்டது`,
  }],
  [/^(.+): look around here$/, {
    zh: (m, p) => `${p(m[1])}：在这附近找找`,
    ms: (m, p) => `${p(m[1])}: cari di sekitar sini`,
    ta: (m, p) => `${p(m[1])}: இங்கே சுற்றிப் பாருங்கள்`,
  }],
  [/^Saved to your account \((.+)\)\.$/, {
    zh: (m) => `已保存到你的账户（${m[1]}）。`,
    ms: (m) => `Disimpan ke akaun anda (${m[1]}).`,
    ta: (m) => `உங்கள் கணக்கில் (${m[1]}) சேமிக்கப்பட்டது.`,
  }],
  [/^You found every spot and collected all (\d+) stamps\. You earned (\d+) reward points on this trail\.$/, {
    zh: (m) => `你找到了所有地点，集齐了全部 ${m[1]} 枚印章。你在这条路线上获得了 ${m[2]} 积分。`,
    ms: (m) => `Anda telah menemui semua lokasi dan mengumpul kesemua ${m[1]} cop. Anda memperoleh ${m[2]} mata ganjaran dalam jejak ini.`,
    ta: (m) => `நீங்கள் எல்லா இடங்களையும் கண்டுபிடித்து ${m[1]} முத்திரைகளையும் சேகரித்துவிட்டீர்கள். இந்தப் பாதையில் ${m[2]} வெகுமதிப் புள்ளிகள் பெற்றீர்கள்.`,
  }],
  [/^Your next clue is waiting on (.+)\.$/, {
    zh: (m, p) => `下一条线索在${p(m[1])}等着你。`,
    ms: (m, p) => `Petunjuk seterusnya menanti di ${p(m[1])}.`,
    ta: (m, p) => `அடுத்த குறிப்பு ${p(m[1])} இல் காத்திருக்கிறது.`,
  }],
  [/^Go to (.+)$/, {
    zh: (m, p) => `前往${p(m[1])}`,
    ms: (m, p) => `Pergi ke ${p(m[1])}`,
    ta: (m, p) => `${p(m[1])} க்குச் செல்`,
  }],
  [/^\+(\d+) reward points?$/, {
    zh: (m) => `+${m[1]} 积分`,
    ms: (m) => `+${m[1]} mata ganjaran`,
    ta: (m) => `+${m[1]} வெகுமதிப் புள்ளி`,
  }],
  [/^(.+) complete! (.+) is now unlocked\.$/, {
    zh: (m, p) => `${p(m[1])}已完成！${p(m[2])}现已解锁。`,
    ms: (m, p) => `${p(m[1])} selesai! ${p(m[2])} kini dibuka.`,
    ta: (m, p) => `${p(m[1])} முடிந்தது! ${p(m[2])} இப்போது திறக்கப்பட்டுள்ளது.`,
  }],
  [/^You already collected the (.+)\. Your next spot is “(.+)”\.$/, {
    zh: (m, p) => `你已经收集过${p(m[1])}了。下一个地点是“${p(m[2])}”。`,
    ms: (m, p) => `Anda sudah mengumpul ${p(m[1])}. Lokasi seterusnya ialah “${p(m[2])}”.`,
    ta: (m, p) => `${p(m[1])} ஐ ஏற்கெனவே சேகரித்துவிட்டீர்கள். அடுத்த இடம் “${p(m[2])}”.`,
  }],
  [/^You already collected the (.+)\.$/, {
    zh: (m, p) => `你已经收集过${p(m[1])}了。`,
    ms: (m, p) => `Anda sudah mengumpul ${p(m[1])}.`,
    ta: (m, p) => `${p(m[1])} ஐ ஏற்கெனவே சேகரித்துவிட்டீர்கள்.`,
  }],
  [/^Not this one yet! That stamp is still locked\. First find “(.+)” and scan its code\.$/, {
    zh: (m, p) => `还不是这个！这枚印章尚未解锁。请先找到“${p(m[1])}”并扫描它的二维码。`,
    ms: (m, p) => `Belum yang ini! Cop itu masih terkunci. Cari “${p(m[1])}” dahulu dan imbas kodnya.`,
    ta: (m, p) => `இது இன்னும் இல்லை! அந்த முத்திரை இன்னும் பூட்டப்பட்டுள்ளது. முதலில் “${p(m[1])}” ஐக் கண்டுபிடித்து அதன் குறியீட்டை ஸ்கேன் செய்யுங்கள்.`,
  }],
  [/^Discovery Trail: (.+)$/, {
    zh: (m, p) => `探索路线：${p(m[1])}`,
    ms: (m, p) => `Jejak Penerokaan: ${p(m[1])}`,
    ta: (m, p) => `ஆய்வுப் பாதை: ${p(m[1])}`,
  }],

  // ---- help ----
  [/^Please stay near (.+) so staff can find you\.$/, {
    zh: (m, p) => `请留在${p(m[1])}附近，方便工作人员找到你。`,
    ms: (m, p) => `Sila tunggu berhampiran ${p(m[1])} supaya kakitangan dapat mencari anda.`,
    ta: (m, p) => `பணியாளர்கள் உங்களைக் கண்டுபிடிக்க ${p(m[1])} அருகிலேயே இருங்கள்.`,
  }],

  [/^MISSION (\d+) \/ (\d+) · CLUE (\d+) \/ (\d+)$/, {
    zh: (m) => `任务 ${m[1]} / ${m[2]} · 线索 ${m[3]} / ${m[4]}`,
    ms: (m) => `MISI ${m[1]} / ${m[2]} · PETUNJUK ${m[3]} / ${m[4]}`,
    ta: (m) => `பணி ${m[1]} / ${m[2]} · குறிப்பு ${m[3]} / ${m[4]}`,
  }],

  // "Level 2 · Rocket Launch Pad" (keep last: it matches any two parts joined by a dot)
  [/^(.+) · (.+)$/, {
    zh: (m, p) => `${p(m[1])} · ${p(m[2])}`,
    ms: (m, p) => `${p(m[1])} · ${p(m[2])}`,
    ta: (m, p) => `${p(m[1])} · ${p(m[2])}`,
  }],
];

/**
 * Translates text that contains a changing part, such as a number or a place name.
 * `lookup` translates a fixed piece of text (it returns the same text when it has no translation).
 * Returns undefined when no pattern matches.
 */
export function translateVisitorPattern(
  text: string,
  language: ChatLanguage,
  lookup: (text: string) => string,
  depth = 0,
): string | undefined {
  if (language === 'en' || depth > 3) return undefined;
  const part: Part = (piece) => {
    const direct = lookup(piece);
    return direct !== piece ? direct : (translateVisitorPattern(piece, language, lookup, depth + 1) ?? piece);
  };
  for (const [pattern, templates] of PATTERNS) {
    const match = text.match(pattern);
    if (!match) continue;
    const result = templates[language](match, part);
    if (result !== text) return result;
  }
  return undefined;
}

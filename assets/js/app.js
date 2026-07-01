        // Inisialisasi ikon Lucide di awal rendering
        lucide.createIcons();

        // Konfigurasi Engine Default (api / local)
        let engineMode = 'api';
        
        // ALAMAT BACKEND WORKER CLOUDFLARE
        const WORKER_URL = 'https://js-obfuscator.mvstream.workers.dev'; 

        // Variabel penampung konfigurasi aktif
        let currentPreset = 'medium';

        // Menyamakan sinkronisasi scroll textarea dan nomor baris
        function updateScroll(textareaId, linesId) {
            const textarea = document.getElementById(textareaId);
            const lines = document.getElementById(linesId);
            lines.scrollTop = textarea.scrollTop;
        }

        // Memperbarui hitungan jumlah baris
        function updateLineNumbers(textareaId, linesId) {
            const textarea = document.getElementById(textareaId);
            const lines = document.getElementById(linesId);
            
            const linesCount = textarea.value.split('\n').length;
            let linesHTML = '';
            for (let i = 1; i <= Math.max(linesCount, 1); i++) {
                linesHTML += i + '<br>';
            }
            lines.innerHTML = linesHTML;
            updateScroll(textareaId, linesId);
        }

        // Mengganti Engine Mode
        function setEngineMode(mode) {
            engineMode = mode;
            
            // Elemen desktop
            const btnApi = document.getElementById('engine-api');
            const btnLocal = document.getElementById('engine-local');
            // Elemen mobile
            const btnApiMob = document.getElementById('engine-api-mobile');
            const btnLocalMob = document.getElementById('engine-local-mobile');
            
            const secNote = document.getElementById('security-note');

            if (mode === 'api') {
                // Desktop styling
                btnApi.className = 'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300 bg-white text-brand-500 shadow-sm';
                btnLocal.className = 'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300 text-slate-500 hover:text-slate-800';
                
                // Mobile styling
                btnApiMob.className = 'py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white text-brand-500 shadow-sm';
                btnLocalMob.className = 'py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all text-slate-500';

                secNote.innerText = 'Kompresi dienkripsi dengan aman melalui Cloudflare API Cloud.';
                showToast('Mesin Beralih: Cloudflare Worker API', 'cpu', 'text-brand-500');
            } else {
                // Desktop styling
                btnLocal.className = 'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300 bg-white text-brand-500 shadow-sm';
                btnApi.className = 'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300 text-slate-500 hover:text-slate-800';
                
                // Mobile styling
                btnLocalMob.className = 'py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white text-brand-500 shadow-sm';
                btnApiMob.className = 'py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all text-slate-500';

                secNote.innerText = 'Pemrosesan 100% aman dan lokal di browser Anda.';
                showToast('Mesin Beralih: Client Browser Lokal', 'monitor', 'text-brand-500');
            }
        }

        // Bind event scroll secara manual ke textarea masing-masing
        document.getElementById('input-code').addEventListener('scroll', () => {
            updateScroll('input-code', 'input-lines');
        });
        document.getElementById('output-code').addEventListener('scroll', () => {
            updateScroll('output-code', 'output-lines');
        });

        // Memuat Kode Demo ke Editor
        function loadDemoCode() {
            const demo = `// Demo Obfuscator Kelas Premium
function hitungPajakTahunan(pendapatanBersih, potongan) {
    const batasPTKP = 54000000;
    let persentaseTarif = 0.05;
    
    if (pendapatanBersih > 120000000) {
        persentaseTarif = 0.15;
    } else if (pendapatanBersih > 60000000) {
        persentaseTarif = 0.10;
    }
    
    const pendapatanKenaPajak = Math.max(0, pendapatanBersih - batasPTKP - potongan);
    const nominalPajak = pendapatanKenaPajak * persentaseTarif;
    
    console.log("Memulai enkripsi kalkulasi rahasia...");
    return {
        pkp: pendapatanKenaPajak,
        tarif: persentaseTarif * 100 + "%",
        pajak: nominalPajak
    };
}

const laporan = hitungPajakTahunan(85000000, 4500000);
console.log("Kalkulasi Selesai:", laporan);`;

            document.getElementById('input-code').value = demo;
            updateLineNumbers('input-code', 'input-lines');
            showToast('Kode demo sukses dimuat.', 'terminal', 'text-brand-500');
        }

        // Membersihkan Editor Input
        function clearInput() {
            document.getElementById('input-code').value = '';
            updateLineNumbers('input-code', 'input-lines');
            showToast('Editor berhasil dikosongkan.', 'trash', 'text-amber-500');
        }

        // Mengembalikan Semua Opsi Lanjutan ke Konfigurasi Awal
        function resetOptions() {
            document.getElementById('opt-compact').checked = true;
            document.getElementById('opt-self-defending').checked = false;
            document.getElementById('opt-rename').checked = true;
            document.getElementById('opt-strings').checked = true;
            document.getElementById('opt-control-flow').checked = false;
            document.getElementById('opt-dead-code').checked = false;
            showToast('Opsi kustomisasi telah direset.', 'rotate-ccw', 'text-slate-400');
        }

        // Pengatur Preset Tingkat Proteksi
        function applyPreset(preset) {
            currentPreset = preset;
            
            const presets = ['low', 'medium', 'high'];
            presets.forEach(p => {
                const btn = document.getElementById(`btn-preset-${p}`);
                // Balikkan gaya visual ke default tidak terpilih
                btn.className = 'preset-btn p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300';
                
                // Setel ulang warna tulisan
                btn.children[0].className = 'font-extrabold text-xs text-slate-900 tracking-wide uppercase';
                btn.children[1].className = 'text-[11px] text-slate-400 font-medium';
            });

            // Berikan gaya visual untuk preset yang sedang dipilih
            const activeBtn = document.getElementById(`btn-preset-${preset}`);
            activeBtn.className = 'preset-btn p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-1 bg-brand-50/50 border-brand-200 text-brand-700 ring-4 ring-brand-100/50';
            activeBtn.children[0].className = 'font-extrabold text-xs text-brand-700 tracking-wide uppercase';
            activeBtn.children[1].className = 'text-[11px] text-brand-600 font-medium';

            // Ubah keadaan Opsi Lanjutan berdasarkan preset terpilih
            if (preset === 'low') {
                document.getElementById('opt-compact').checked = true;
                document.getElementById('opt-self-defending').checked = false;
                document.getElementById('opt-rename').checked = false;
                document.getElementById('opt-strings').checked = false;
                document.getElementById('opt-control-flow').checked = false;
                document.getElementById('opt-dead-code').checked = false;
            } else if (preset === 'medium') {
                document.getElementById('opt-compact').checked = true;
                document.getElementById('opt-self-defending').checked = false;
                document.getElementById('opt-rename').checked = true;
                document.getElementById('opt-strings').checked = true;
                document.getElementById('opt-control-flow').checked = false;
                document.getElementById('opt-dead-code').checked = false;
            } else if (preset === 'high') {
                document.getElementById('opt-compact').checked = true;
                document.getElementById('opt-self-defending').checked = true;
                document.getElementById('opt-rename').checked = true;
                document.getElementById('opt-strings').checked = true;
                document.getElementById('opt-control-flow').checked = true;
                document.getElementById('opt-dead-code').checked = true;
            }

            showToast(`Preset Proteksi: ${preset.toUpperCase()}`, 'sliders', 'text-brand-500');
        }

        // Inti Logika Obfuscator (Hybrid: Cloudflare Worker & Browser Engine)
        async function obfuscateCode() {
            const codeInput = document.getElementById('input-code').value.trim();
            if (!codeInput) {
                showToast('Silakan masukkan kode JavaScript!', 'alert-triangle', 'text-rose-500');
                return;
            }

            const startTime = performance.now();
            const btn = document.getElementById('btn-obfuscate');
            
            // Atur tombol ke status Loading
            btn.disabled = true;
            btn.classList.add('opacity-70', 'cursor-not-allowed');
            btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin text-brand-500"></i> <span>Memproses Proteksi Kode...</span>';
            lucide.createIcons();

            // Mengumpulkan pilihan status opsi lanjutan
            const isCompact = document.getElementById('opt-compact').checked;
            const isSelfDefending = document.getElementById('opt-self-defending').checked;
            const isRename = document.getElementById('opt-rename').checked;
            const isStrings = document.getElementById('opt-strings').checked;
            const isControlFlow = document.getElementById('opt-control-flow').checked;
            const isDeadCode = document.getElementById('opt-dead-code').checked;

            const obfuscationOptions = {
                compact: isCompact,
                selfDefending: isSelfDefending,
                identifierNamesGenerator: isRename ? 'hexadecimal' : 'dictionary',
                renameGlobals: isRename,
                stringArray: isStrings,
                stringArrayEncoding: isStrings ? ['base64'] : [],
                stringArrayThreshold: isStrings ? 0.75 : 0,
                controlFlowFlattening: isControlFlow,
                controlFlowFlatteningThreshold: isControlFlow ? 0.75 : 0,
                deadCodeInjection: isDeadCode,
                deadCodeInjectionThreshold: isDeadCode ? 0.4 : 0
            };

            // JALUR UTAMA: Memproses via Cloudflare Worker API
            if (engineMode === 'api') {
                try {
                    const response = await fetch(WORKER_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            code: codeInput,
                            options: obfuscationOptions
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Respons jaringan bermasalah.');
                    }

                    const data = await response.json();

                    if (data.success) {
                        document.getElementById('output-code').value = data.obfuscatedCode;
                        updateLineNumbers('output-code', 'output-lines');

                        // Hitung performa & perbarui statistik di layar
                        const originalBytes = data.stats.originalSize;
                        const obfuscatedBytes = data.stats.obfuscatedSize;
                        const totalTime = (performance.now() - startTime).toFixed(1);

                        updateStatsUI(originalBytes, obfuscatedBytes, totalTime);
                        showToast('Kode berhasil dienkripsi (Cloud Worker API)', 'shield', 'text-emerald-500');
                        
                        finishObfuscation(btn);
                        return;
                    } else {
                        throw new Error(data.error || 'Terjadi gangguan eksekusi di server.');
                    }

                } catch (error) {
                    console.warn("API Gagal, beralih otomatis ke lokal engine:", error.message);
                    showToast('API Offline, memproses otomatis di internal browser...', 'wifi-off', 'text-amber-500');
                }
            }

            // JALUR CADANGAN: Memproses Lokal di Browser Client
            try {
                // Memberikan waktu render micro-loop agar browser merender status loading terlebih dahulu
                await new Promise(resolve => setTimeout(resolve, 80));

                const obfuscationResult = JavaScriptObfuscator.obfuscate(codeInput, obfuscationOptions);
                const resultText = obfuscationResult.getObfuscatedCode();

                document.getElementById('output-code').value = resultText;
                updateLineNumbers('output-code', 'output-lines');

                // Hitung performa & perbarui statistik di layar secara lokal
                const originalBytes = new Blob([codeInput]).size;
                const obfuscatedBytes = new Blob([resultText]).size;
                const totalTime = (performance.now() - startTime).toFixed(1);

                updateStatsUI(originalBytes, obfuscatedBytes, totalTime);
                showToast('Kode terproteksi sukses (Lokal Browser)', 'check-circle', 'text-emerald-500');

            } catch (error) {
                console.error(error);
                showToast('Gagal memproses. Periksa kembali sintaks JavaScript Anda!', 'alert-circle', 'text-rose-500');
            } finally {
                finishObfuscation(btn);
            }
        }

        // Memperbarui Elemen Statistik Kompresi
        function updateStatsUI(originalBytes, obfuscatedBytes, totalTime) {
            document.getElementById('stat-original-size').innerText = formatBytes(originalBytes);
            document.getElementById('stat-obfuscated-size').innerText = formatBytes(obfuscatedBytes);
            
            const percentChange = ((obfuscatedBytes - originalBytes) / originalBytes * 100).toFixed(1);
            const sign = percentChange > 0 ? '+' : '';
            const ratioElement = document.getElementById('stat-ratio');
            
            ratioElement.innerText = `${sign}${percentChange}%`;
            
            if (percentChange > 0) {
                ratioElement.className = 'text-xs font-extrabold text-amber-500';
            } else {
                ratioElement.className = 'text-xs font-extrabold text-emerald-500';
            }

            document.getElementById('stat-time').innerText = `${totalTime} ms`;
        }

        // Mengembalikan Keadaan Tombol Setelah Pemrosesan Selesai
        function finishObfuscation(btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-70', 'cursor-not-allowed');
            btn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 text-brand-500"></i> <span>Acak Kode Sekarang</span>';
            lucide.createIcons();
        }

        // Pembantu Format Bytes ke Satuan Memori
        function formatBytes(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Salin Output ke Clipboard
        function copyOutput() {
            const outCode = document.getElementById('output-code');
            if (!outCode.value || outCode.value.startsWith('// Hasil')) {
                showToast('Tidak ada kode yang dapat disalin!', 'alert-triangle', 'text-amber-500');
                return;
            }

            // Menyalin teks menggunakan cara paling handal di dalam iFrame
            outCode.select();
            outCode.setSelectionRange(0, 99999); // Optimalisasi platform mobile
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showToast('Kode berhasil disalin ke clipboard!', 'clipboard', 'text-emerald-400');
                } else {
                    showToast('Gagal menyalin kode.', 'alert-circle', 'text-rose-500');
                }
            } catch (err) {
                showToast('Gagal menyalin kode.', 'alert-circle', 'text-rose-500');
            }
        }

        // Pembantu Animasi Toast Premium
        let toastTimeout;
        function showToast(message, iconName = 'check-circle', iconColorClass = 'text-emerald-400') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toast-message');
            const toastIcon = document.getElementById('toast-icon');
            const toastIconBg = document.getElementById('toast-icon-bg');

            // Sesuaikan pesan dan ikon dinamis
            toastMessage.innerText = message;
            toastIcon.setAttribute('data-lucide', iconName);
            toastIcon.className = `w-4 h-4 ${iconColorClass}`;
            
            // Konfigurasi latar belakang ikon agar selaras
            if (iconColorClass.includes('emerald')) {
                toastIconBg.className = 'p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center';
            } else if (iconColorClass.includes('brand') || iconColorClass.includes('sky')) {
                toastIconBg.className = 'p-1.5 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center';
            } else if (iconColorClass.includes('amber')) {
                toastIconBg.className = 'p-1.5 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center';
            } else if (iconColorClass.includes('rose')) {
                toastIconBg.className = 'p-1.5 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center';
            } else {
                toastIconBg.className = 'p-1.5 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center';
            }

            // Segarkan render ikon Lucide baru
            lucide.createIcons();

            // Mulai tampilkan efek animasi masuk
            toast.classList.remove('translate-y-20', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            // Bersihkan timeout antrean sebelumnya
            clearTimeout(toastTimeout);

            toastTimeout = setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3500);
        }

        // Tampilkan demo instan saat aplikasi pertama kali dimuat
        window.onload = function() {
            loadDemoCode();
        }
document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // CONFIG
    // =====================================================

    const LICENSE_B64 = 'aHR0cHM6Ly83ODk3Z2l0LmdpdGh1Yi5pbw==';
    const LICENSE_URL = atob(LICENSE_B64);

    const metaLicense =
        document.querySelector('meta[name="license"]')
            ?.getAttribute('content') || '';

    const adImageUrl =
        document.querySelector('meta[name="ads-image"]')
            ?.getAttribute('content') || '';

    const adTargetUrl =
        document.querySelector('meta[name="ads-link"]')
            ?.getAttribute('content') || '#';

    let isValid = false;

    // =====================================================
    // VALIDASI LICENSE
    // =====================================================

    try {
        if (
            metaLicense === LICENSE_B64 ||
            metaLicense === LICENSE_URL
        ) {
            isValid = true;
        } else {
            isValid = atob(metaLicense) === LICENSE_URL;
        }
    } catch (err) {
        isValid = false;
    }

    // =====================================================
    // LOCK TEMPLATE FUNCTION (SUPER PRO, ELEGANT & RESPONSIVE)
    // =====================================================

    function lockTemplate(reason = 'License Invalid') {
        if (document.getElementById('peringatan')) return;

        const lockHtml = `
        <style id="peringatan-style">
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
            
            html, body {
                overflow: hidden !important;
                height: 100% !important;
                position: fixed !important;
                width: 100% !important;
            }
            
            #peringatan {
                position: fixed;
                inset: 0;
                z-index: 99999999999;
                background: rgba(9, 9, 11, 0.98);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                color: #f4f4f5;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 16px;
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                box-sizing: border-box;
            }

            .lock-card {
                background: rgba(20, 20, 23, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.05);
                padding: 40px 24px;
                border-radius: 24px;
                max-width: 440px;
                width: 100%;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                align-items: center;
                box-sizing: border-box;
                animation: lockAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            .lock-icon-wrapper {
                width: 56px;
                height: 56px;
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.2);
                border-radius: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
                color: #ef4444;
            }

            #peringatan h2 {
                margin: 0 0 12px;
                font-size: 22px;
                font-weight: 600;
                letter-spacing: -0.02em;
                color: #ffffff;
            }

            #peringatan p.reason-tag {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                color: #ef4444;
                font-weight: 600;
                background: rgba(239, 68, 68, 0.08);
                padding: 4px 12px;
                border-radius: 100px;
                margin-bottom: 16px;
                border: 1px solid rgba(239, 68, 68, 0.15);
            }

            #peringatan p.desc {
                font-size: 13px;
                line-height: 1.6;
                color: #a1a1aa;
                margin: 0 0 28px;
                font-weight: 300;
            }

            .countdown-container {
                position: relative;
                width: 72px;
                height: 72px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .countdown-svg {
                position: absolute;
                inset: 0;
                transform: rotate(-90deg);
                width: 100%;
                height: 100%;
            }

            .countdown-svg circle {
                fill: none;
                stroke-width: 3;
            }

            .countdown-bg {
                stroke: rgba(255, 255, 255, 0.05);
            }

            .countdown-bar {
                stroke: #ef4444;
                stroke-dasharray: 220;
                stroke-dashoffset: 0;
                transition: stroke-dashoffset 1s linear;
            }

            #aktivasi {
                font-size: 20px;
                color: #ffffff;
                font-weight: 600;
                z-index: 2;
            }

            @keyframes lockAppear {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Responsive Khusus HP Kecil */
            @media (max-width: 360px) {
                .lock-card {
                    padding: 32px 16px;
                }
                #peringatan h2 {
                    font-size: 18px;
                }
                #peringatan p.desc {
                    font-size: 12px;
                }
            }
        </style>
        
        <div id="peringatan">
            <div class="lock-card">
                <div class="lock-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                
                <p class="reason-tag">${reason}</p>
                <h2>System Locked</h2>
                <p class="desc">
                    Lisensi meta tidak valid atau kredit footer dimodifikasi secara ilegal. Silakan hubungi pengembang untuk aktivasi kembali.
                </p>

                <div class="countdown-container">
                    <svg class="countdown-svg" viewBox="0 0 80 80">
                        <circle class="countdown-bg" cx="40" cy="40" r="35"></circle>
                        <circle class="countdown-bar" id="countdownBar" cx="40" cy="40" r="35"></circle>
                    </svg>
                    <span id="aktivasi">10</span>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lockHtml);

        let second = 10;
        const totalDuration = 10;
        const circleRadius = 35;
        const circumference = 2 * Math.PI * circleRadius;

        const countdownBar = document.getElementById('countdownBar');
        if (countdownBar) {
            countdownBar.style.strokeDasharray = circumference;
            countdownBar.style.strokeDashoffset = 0;
        }

        const timer = setInterval(() => {
            second--;

            const el = document.getElementById('aktivasi');
            if (el) el.textContent = second;

            if (countdownBar) {
                const offset = circumference - (second / totalDuration) * circumference;
                countdownBar.style.strokeDashoffset = offset;
            }

            if (second <= 0) {
                clearInterval(timer);
                window.location.href = 'https://7897git.github.io/blog/';
            }
        }, 1000);
    }

    if (!isValid) {
        lockTemplate('Meta License Invalid');
        return;
    }

    // =====================================================
    // FOOTER SELECTION
    // =====================================================

    const footer =
        document.getElementById('footer') ||
        document.querySelector('footer') ||
        document.querySelector('.footer');

    if (!footer) {
        lockTemplate('Missing Footer Element');
        return;
    }

    // =====================================================
    // CREDIT ID GENERATOR
    // =====================================================

    const creditId = btoa(
        LICENSE_URL
            .split('')
            .reduce((sum, c) => sum + c.charCodeAt(0), 0)
            .toString()
    )
    .replace(/=/g, '')
    .substring(0, 10);

    // =====================================================
    // INJECT CREDIT
    // =====================================================

    const credit = document.createElement('div');
    credit.id = 'git-license-credit';
    credit.innerHTML = `
        <a href="${LICENSE_URL}"
           target="_blank"
           rel="noopener noreferrer"
           id="git-credit-link">
           Powered by nDang - License #${creditId}
        </a>
    `;

    credit.style.cssText = `
        margin-top: 12px !important;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
        font-size: 0.75rem !important;
        font-weight: 500 !important;
        color: rgb(148 163 184) !important;
        letter-spacing: 0.03em !important;
        opacity: .6 !important;
        display: block !important;
        visibility: visible !important;
        text-align: center !important;
        transition: opacity 0.3s !important;
    `;

    footer.appendChild(credit);

    // =====================================================
    // WATCHDOG (ULTRA SECURITY)
    // =====================================================

    setInterval(() => {
        const creditEl = document.getElementById('git-license-credit');
        const footerEl =
            document.getElementById('footer') ||
            document.querySelector('footer') ||
            document.querySelector('.footer');

        // 1. Cek keberadaan elemen fisik
        if (!footerEl || !creditEl) {
            lockTemplate('Credit Dihapus dari DOM');
            return;
        }

        // 2. Cek apakah disembunyikan menggunakan CSS (display / opacity / visibility)
        const style = window.getComputedStyle(creditEl);
        const opacity = parseFloat(style.opacity);
        
        if (
            style.display === 'none' || 
            style.visibility === 'hidden' || 
            opacity < 0.1 ||
            creditEl.offsetHeight === 0
        ) {
            lockTemplate('CSS Hiding Detected');
            return;
        }

        // 3. Cek manipulasi isi Link / URL tujuan
        const linkEl = document.getElementById('git-credit-link');
        if (!linkEl || linkEl.getAttribute('href') !== LICENSE_URL) {
            lockTemplate('License URL Tampered');
            return;
        }

        // 4. Cek manipulasi Teks Kredit (Mencegah nama diganti)
        if (!linkEl.textContent.includes('nDang')) {
            lockTemplate('Credit Text Renamed');
            return;
        }

    }, 3000);

    // =====================================================
    // IKLAN (AD MODAL - MODERN, MINIMALIST & MOBILE FRIENDLY)
    // =====================================================

    if (adImageUrl && adTargetUrl) {
        document.body.insertAdjacentHTML(
            'beforeend',
            `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

                .modal-overlay-ad {
                    position: fixed;
                    inset: 0;
                    background: rgba(9, 9, 11, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999999;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                    padding: 16px; /* Mencegah modal menyentuh tepi layar HP */
                    box-sizing: border-box;
                }

                .modal-overlay-ad.show {
                    opacity: 1;
                    pointer-events: auto;
                }

                .modal-content-ad {
                    width: 100%;
                    max-width: 380px;
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    border-radius: 24px;
                    padding: 32px 20px 24px;
                    position: relative;
                    text-align: center;
                    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.25);
                    transform: scale(0.93) translateY(15px);
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    box-sizing: border-box;
                }

                .modal-overlay-ad.show .modal-content-ad {
                    transform: scale(1) translateY(0);
                }

                /* Close button mobile friendly dengan area ketuk 44px */
                .close-ad-btn {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    border: none;
                    background: none;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    color: #71717a;
                    transition: all 0.2s ease;
                    border-radius: 50%;
                    -webkit-tap-highlight-color: transparent;
                }

                .close-ad-btn-inner {
                    background: rgba(0, 0, 0, 0.04);
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.2s ease;
                }

                .close-ad-btn:hover .close-ad-btn-inner {
                    background: rgba(0, 0, 0, 0.08);
                    color: #18181b;
                    transform: rotate(90deg);
                }

                .close-ad-btn svg {
                    width: 12px;
                    height: 12px;
                }

                .modal-content-ad h3 {
                    margin: 8px 0 6px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #3b82f6;
                }

                .modal-content-ad h2 {
                    margin: 0 0 16px;
                    font-size: 18px;
                    font-weight: 700;
                    color: #18181b;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                }

                .ad-image-container {
                    position: relative;
                    width: 100%;
                    height: 400px;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                }

                .ad-image {
                    width: 100%;
                    height: auto;
                    display: block;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                /* Efek hover dinonaktifkan di layar sentuh agar transisi mulus */
                @media (hover: hover) {
                    .ad-image-container:hover .ad-image {
                        transform: scale(1.03);
                    }
                }

                .ad-link-btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    width: 100%;
                    padding: 12px 20px;
                    background: #18181b;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                    -webkit-tap-highlight-color: transparent;
                }

                .ad-link-btn:active {
                    background: #27272a;
                    transform: scale(0.98);
                }

                @media (hover: hover) {
                    .ad-link-btn:hover {
                        background: #27272a;
                        box-shadow: 0 8px 20px -6px rgba(24, 24, 27, 0.4);
                        transform: translateY(-1px);
                    }
                    .ad-link-btn:hover svg {
                        transform: translateX(3px);
                    }
                }

                .ad-link-btn svg {
                    width: 14px;
                    height: 14px;
                    transition: transform 0.2s ease;
                }

                /* Penyesuaian khusus HP Layar Kecil */
                @media (max-width: 360px) {
                    .modal-content-ad {
                        padding: 24px 16px 16px;
                    }
                    .modal-content-ad h2 {
                        font-size: 16px;
                    }
                }
            </style>

            <div class="modal-overlay-ad" id="adModal">
                <div class="modal-content-ad">
                    <button id="closeAdBtn" class="close-ad-btn" aria-label="Close ad">
                        <div class="close-ad-btn-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </button>

                    <h3>Limited Offer</h3>
                    <h2>Promo Spesial Hari Ini!</h2>

                    <div class="ad-image-container">
                        <a href="${adTargetUrl}" target="_blank">
                            <img src="${adImageUrl}" class="ad-image" alt="Iklan Promo">
                        </a>
                    </div>

                    <a href="${adTargetUrl}" target="_blank" class="ad-link-btn">
                        Cek Sekarang
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                </div>
            </div>
            `
        );

        const modal = document.getElementById('adModal');
        const closeBtn = document.getElementById('closeAdBtn');

        setTimeout(() => {
            modal?.classList.add('show');
        }, 2000);

        closeBtn?.addEventListener('click', () => modal.classList.remove('show'));

        modal?.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});
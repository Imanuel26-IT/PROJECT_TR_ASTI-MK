/* =============================================
   LBus — Bus Ticket Booking Script
   ============================================= */

   "use strict";

   const state = {
     selectedSeats: [],
     toastTimer: null,
   };
   
   const PRICE_PER_SEAT = 250000;
   const INSURANCE_PER_SEAT = 5000;
   const BOOKING_KEY = "lbus_booking";
   
   function formatRupiah(num) {
     return "Rp " + num.toLocaleString("id-ID");
   }
   
   /* ---------- Booking state (dipakai lintas halaman) ---------- */
   function saveBooking(data) {
     try {
       localStorage.setItem(BOOKING_KEY, JSON.stringify(data));
     } catch (e) {
       /* ignore */
     }
   }
   
   function loadBooking() {
     try {
       return JSON.parse(localStorage.getItem(BOOKING_KEY));
     } catch (e) {
       return null;
     }
   }
   
   function getBookingState() {
     const saved = loadBooking();
     if (saved && Array.isArray(saved.seats) && saved.seats.length) {
       return {
         seats: saved.seats,
         seatCount: saved.seats.length,
         insurance: typeof saved.insurance === "boolean" ? saved.insurance : true,
       };
     }
     return { seats: ["1A"], seatCount: 1, insurance: true };
   }
   
   function computeTotal(seatCount, insurance) {
     const seatTotal = seatCount * PRICE_PER_SEAT;
     const insuranceTotal = insurance ? seatCount * INSURANCE_PER_SEAT : 0;
     return seatTotal + insuranceTotal;
   }
   
   function showToast(msg) {
     const toast = document.getElementById("toast");
     if (!toast) return;
     clearTimeout(state.toastTimer);
     toast.textContent = msg;
     toast.classList.add("show");
     state.toastTimer = setTimeout(() => {
       toast.classList.remove("show");
     }, 2500);
   }
   
   function updateBottomBar() {
     const bottomBar = document.getElementById('bottomBar');
     const seatCount = document.getElementById('seatCount');
     const seatNumber = document.getElementById('seatNumber');
     const seatPrice = document.getElementById('seatPrice');
     const payBtn = document.getElementById('payBtn');
   
     const count = state.selectedSeats.length;
   
     if (count > 0) {
       bottomBar?.classList.add('active');
       if (seatCount) seatCount.textContent = count + " Kursi";
       if (seatNumber) seatNumber.textContent = state.selectedSeats.map(s => "S No." + s).join(', ');
       if (seatPrice) seatPrice.textContent = formatRupiah(count * PRICE_PER_SEAT);
       if (payBtn) {
         payBtn.style.pointerEvents = 'auto';
         payBtn.style.opacity = '1';
       }
     } else {
       bottomBar?.classList.remove('active');
       if (payBtn) {
         payBtn.style.pointerEvents = 'none';
         payBtn.style.opacity = '0.5';
       }
     }
   }
   
   function initSeatSelection() {
     const seats = document.querySelectorAll('.seat.available');
     if (!seats.length) return;
   
     seats.forEach(seat => {
       seat.addEventListener('click', function() {
         const seatId = this.dataset.seat;
   
         if (this.classList.contains('selected')) {
           this.classList.remove('selected');
           state.selectedSeats = state.selectedSeats.filter(s => s !== seatId);
           showToast('Kursi ' + seatId + ' dibatalkan');
         } else {
           this.classList.add('selected');
           state.selectedSeats.push(seatId);
           showToast('Kursi ' + seatId + ' dipilih');
         }
   
         saveBooking({ seats: state.selectedSeats, insurance: true });
         updateBottomBar();
       });
     });
   
     const payBtn = document.getElementById('payBtn');
     if (payBtn) {
       payBtn.style.pointerEvents = 'none';
       payBtn.style.opacity = '0.5';
     }
   }
   
   function initFacilitiesToggle() {
     const toggle = document.querySelector('.facilities-toggle');
     const list = document.querySelector('.facilities-list');
     if (!toggle || !list) return;
   
     toggle.addEventListener('click', function() {
       const expanded = list.classList.toggle('expanded');
   
       if (expanded) {
         this.innerHTML = 'Sembunyikan fasilitas <i class="ti ti-chevron-up"></i>';
       } else {
         this.innerHTML = 'Lihat semua fasilitas <i class="ti ti-chevron-down"></i>';
       }
     });
   }
   
   /* Toggle payment group expand/collapse */
   function toggleGroup(header) {
     const body = header.nextElementSibling;
     const icon = header.querySelector('.toggle-icon');
   
     if (!body) return;
   
     if (body.classList.contains('open')) {
       body.classList.remove('open');
       body.style.maxHeight = '0';
       header.classList.remove('open');
     } else {
       body.classList.add('open');
       body.style.maxHeight = body.scrollHeight + 'px';
       header.classList.add('open');
     }
   }
   
   /* Copy VA number to clipboard */
   function copyVA() {
     const vaNumber = document.getElementById('vaNumber');
     const copyBtn = document.querySelector('.copy-btn');
   
     if (!vaNumber) return;
   
     const text = vaNumber.textContent.trim();
   
     navigator.clipboard.writeText(text).then(() => {
       if (copyBtn) {
         copyBtn.classList.add('copied');
         copyBtn.innerHTML = '<i class="ti ti-check"></i>';
         showToast('Nomor VA berhasil disalin!');
   
         setTimeout(() => {
           copyBtn.classList.remove('copied');
           copyBtn.innerHTML = '<i class="ti ti-copy"></i>';
         }, 2000);
       }
     }).catch(() => {
       // Fallback for older browsers
       const textarea = document.createElement('textarea');
       textarea.value = text;
       textarea.style.position = 'fixed';
       textarea.style.opacity = '0';
       document.body.appendChild(textarea);
       textarea.select();
       document.execCommand('copy');
       document.body.removeChild(textarea);
       showToast('Nomor VA berhasil disalin!');
     });
   }
   
   /* Initialize payment groups */
   function initPaymentGroups() {
     const groups = document.querySelectorAll('.payment-group-body');
     groups.forEach(body => {
       if (body.classList.contains('open')) {
         body.style.maxHeight = body.scrollHeight + 'px';
       } else {
         body.style.maxHeight = '0';
       }
     });
   }
   
   /* Print ticket */
   function printTicket() {
     window.print();
   }
   
   /* Sinkronkan jumlah kursi & harga total (termasuk asuransi) di halaman
      page3 s/d page7. Fungsi ini aman dipanggil di semua halaman karena
      hanya menyentuh elemen yang benar-benar ada di DOM. */
   function initBookingSummary() {
     // Jangan jalan di page1 — di sana harga sudah ditangani updateBottomBar()
     // berdasarkan seleksi kursi yang sedang berlangsung, bukan booking tersimpan.
     if (document.getElementById('seatCount')) return;
   
     const booking = getBookingState();
     let insurance = booking.insurance;
   
     // Update teks jumlah kursi (booking-summary & tiket)
     document.querySelectorAll('.summary-seat span').forEach(el => {
       el.textContent = booking.seatCount + ' Kursi';
     });
   
     const bottomSub = document.querySelector('.bottom-sub');
     if (bottomSub && bottomSub.textContent.includes('Kursi')) {
       bottomSub.textContent = booking.seatCount + ' Kursi, termasuk biaya layanan';
     }
   
     const busType = document.querySelector('.bus-type');
     if (busType) {
       busType.textContent = 'Executive Bus 2+2 - ' + booking.seatCount + ' Kursi';
     }
   
     function refreshPrice() {
       const total = computeTotal(booking.seatCount, insurance);
   
       document.querySelectorAll('.bottom-bar .seat-price').forEach(el => {
         el.textContent = formatRupiah(total);
       });
   
       const vaAmount = document.querySelector('.va-amount');
       if (vaAmount) vaAmount.textContent = formatRupiah(total);
   
       const ticketPrice = document.querySelector('.detail-value.price');
       if (ticketPrice) ticketPrice.textContent = 'RP ' + total.toLocaleString('id-ID');
   
       saveBooking({ seats: booking.seats, insurance });
     }
   
     const insuranceCheckbox = document.querySelector('.insurance-toggle input[type="checkbox"]');
     if (insuranceCheckbox) {
       insuranceCheckbox.checked = insurance;
       insuranceCheckbox.addEventListener('change', () => {
         insurance = insuranceCheckbox.checked;
         refreshPrice();
       });
     }
   
     refreshPrice();
   }
   
   /* Toggle checkbox pilih penumpang */
   function initPassengerCheck() {
     const checks = document.querySelectorAll('.passenger-check');
     checks.forEach(btn => {
       btn.addEventListener('click', function() {
         this.classList.toggle('checked');
       });
     });
   }
   
   document.addEventListener("DOMContentLoaded", () => {
     initSeatSelection();
     initFacilitiesToggle();
     initPaymentGroups();
     initBookingSummary();
     initPassengerCheck();
   });
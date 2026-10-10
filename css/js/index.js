
/* =========================================
   GAPDONG - WEBSITE INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("languageSelect");
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");
  const year = document.getElementById("year");
  const backTop = document.getElementById("backTop");

  // Automatically update the copyright year.
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // LANGUAGE SWITCH: English <-> Korean
  function changeLanguage(language) {
    const selectedLanguage = language === "ko" ? "ko" : "en";

    document.documentElement.lang = selectedLanguage;
    document.body.dataset.lang = selectedLanguage;

    document.querySelectorAll("[data-en][data-ko]").forEach((element) => {
      const translation = element.getAttribute(`data-${selectedLanguage}`);

      if (translation !== null) {
        element.textContent = translation;
      }
    });

    // Update input placeholders.
    document.querySelectorAll("[data-placeholder-en][data-placeholder-ko]")
      .forEach((input) => {
        input.placeholder =
          input.getAttribute(`data-placeholder-${selectedLanguage}`);
      });

    // Update the chatbot's opening message when the language changes.
    const welcomeMessage = document.querySelector(
      "#chatMessages .bot-message"
    );

    if (welcomeMessage && !chatHasConversation) {
      welcomeMessage.textContent =
        selectedLanguage === "ko"
          ? "안녕하세요! 갑동에 오신 것을 환영합니다. 식당에 대해 무엇이 궁금하신가요?"
          : "Hello! Welcome to Gapdong. What would you like to know about our restaurant?";
    }

    if (languageSelect) {
      languageSelect.value = selectedLanguage;
    }
  }

  if (languageSelect) {
    languageSelect.addEventListener("change", (event) => {
      changeLanguage(event.target.value);
    });
  }

  // Start in English.
  changeLanguage("en");

  // MOBILE NAVIGATION
  function closeMobileMenu() {
    if (!navigation || !menuToggle) return;

    navigation.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");

      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();

        navigation.querySelectorAll(".nav-link").forEach((item) => {
          item.classList.remove("active");
        });

        link.classList.add("active");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) {
        closeMobileMenu();
      }
    });
  }

  // BACK TO TOP
  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // HIGHLIGHT NAVIGATION SECTION
  const sections = document.querySelectorAll(
    "#story, #food, #visit, #contact"
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const matchingLink = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`
          );

          if (matchingLink) {
            document.querySelectorAll(".nav-link").forEach((link) => {
              link.classList.remove("active");
            });

            matchingLink.classList.add("active");
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // =========================================
  // RESTAURANT INFORMATION CHATBOT
  // This is a local FAQ chatbot, not a live AI.
  // =========================================

  const chatBubble = document.getElementById("chatBubble");
  const chatPanel = document.getElementById("chatPanel");
  const chatClose = document.getElementById("chatClose");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const quickQuestions = document.querySelectorAll("[data-question]");

  let chatHasConversation = false;

  function getLanguage() {
    return document.documentElement.lang === "ko" ? "ko" : "en";
  }

  function openChat() {
    if (!chatPanel || !chatBubble) return;

    chatPanel.hidden = false;
    chatBubble.setAttribute("aria-expanded", "true");

    if (chatInput) {
      chatInput.focus();
    }
  }

  function closeChat() {
    if (!chatPanel || !chatBubble) return;

    chatPanel.hidden = true;
    chatBubble.setAttribute("aria-expanded", "false");
    chatBubble.focus();
  }

  if (chatBubble && chatPanel) {
    chatBubble.setAttribute("aria-expanded", "false");

    chatBubble.addEventListener("click", () => {
      if (chatPanel.hidden) {
        openChat();
      } else {
        closeChat();
      }
    });
  }

  if (chatClose) {
    chatClose.addEventListener("click", closeChat);
  }

  function addMessage(text, type) {
    if (!chatMessages) return;

    const message = document.createElement("div");
    message.className =
      type === "user" ? "message user-message" : "message bot-message";

    // textContent prevents user input from being interpreted as HTML.
    message.textContent = text;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getAnswer(topic) {
    const ko = getLanguage();

    const answers = {
      food: {
        en: "Gapdong is listed as a charcoal freshwater eel restaurant. The photographs on this website illustrate Korean food, but they do not confirm the actual menu. Please call +82 42-300-0448 to ask about available eel dishes, side dishes, ingredients and allergens.",
        ko: "갑동은 숯불 민물장어 전문점으로 안내되어 있습니다. 웹사이트의 음식 사진은 한국 음식의 예시이며 실제 메뉴를 보장하지 않습니다. 장어 요리, 반찬, 재료 및 알레르기 정보는 +82 42-300-0448로 문의해 주세요."
      },

      ingredients: {
        en: "For exact ingredients, sauces, cooking oils and possible allergens, please speak directly with the restaurant at +82 42-300-0448. We don't have a verified ingredient list for individual dishes.",
        ko: "정확한 재료, 양념, 조리용 기름 및 알레르기 유발 성분은 식당(+82 42-300-0448)에 직접 문의해 주세요. 개별 요리의 검증된 재료 목록은 아직 없습니다."
      },

      price: {
        en: "The listed price range is ₩30,000–₩80,000. Actual prices may vary by dish and serving size, so please confirm the current menu and prices with the restaurant.",
        ko: "안내된 가격대는 ₩30,000–₩80,000입니다. 메뉴와 제공량에 따라 가격이 달라질 수 있으니 최신 메뉴와 가격은 식당에 확인해 주세요."
      },

      hours: {
        en: "The provided listing says the restaurant opens at 11:00 AM. We don't have verified closing times or a full weekly schedule. Please call +82 42-300-0448 before travelling.",
        ko: "제공된 정보에는 오전 11시 영업 시작으로 안내되어 있습니다. 정확한 마감 시간과 주간 영업 일정은 확인되지 않았으니 방문 전에 +82 42-300-0448로 문의해 주세요."
      },

      location: {
        en: "The supplied address is 19beonji 327 Gap-dong, Yuseong District, Daejeon, South Korea. You can open the Google Maps link in the Visit Us section. Please verify the exact street address and map pin before travelling.",
        ko: "제공된 주소는 대한민국 대전광역시 유성구 갑동 327번지 19번지입니다. 오시는 길 섹션에서 Google 지도를 열 수 있습니다. 방문 전에 정확한 도로명 주소와 지도 위치를 확인해 주세요."
      },

      reservation: {
        en: "For table availability and reservations, please call +82 42-300-0448. This homepage does not yet have a connected reservation system.",
        ko: "좌석 가능 여부와 예약은 +82 42-300-0448로 문의해 주세요. 현재 홈페이지에는 예약 시스템이 연결되어 있지 않습니다."
      },

      contact: {
        en: "You can contact the restaurant at +82 42-300-0448. The address and Google Maps directions are available in the Visit Us section.",
        ko: "식당 전화번호는 +82 42-300-0448입니다. 주소와 Google 지도 길 안내는 오시는 길 섹션에서 확인하실 수 있습니다."
      },

      thanks: {
        en: "You're welcome! If you need more details, please call the restaurant at +82 42-300-0448. We hope you enjoy your Korean dining experience.",
        ko: "천만에요! 더 자세한 정보는 +82 42-300-0448로 문의해 주세요. 즐거운 한국 음식 경험이 되시길 바랍니다."
      },

      unknown: {
        en: "I can help with the food, ingredients, listed price range, opening hours, location and reservation enquiries. For anything not listed here, please contact the restaurant at +82 42-300-0448.",
        ko: "음식, 재료, 안내된 가격대, 영업시간, 위치 및 예약 문의를 도와드릴 수 있습니다. 그 외의 사항은 +82 42-300-0448로 식당에 문의해 주세요."
      }
    };

    return answers[topic]?.[ko] || answers.unknown[ko];
  }

  function detectTopic(question) {
    const text = question.toLowerCase().trim();

    if (
      /thank|thanks|고마워|감사합니다|감사해/.test(text)
    ) {
      return "thanks";
    }

    if (
      /reserv|book a table|booking|table available|예약|자리 있|좌석/.test(text)
    ) {
      return "reservation";
    }

    if (
      /ingredient|allerg|allergen|contains|재료|알레르기|성분|들어가/.test(text)
    ) {
      return "ingredients";
    }

    if (
      /price|cost|expensive|cheap|how much|₩|가격|얼마|비용/.test(text)
    ) {
      return "price";
    }

    if (
      /hour|open|close|closing|today|시간|영업|몇 시|오늘/.test(text)
    ) {
      return "hours";
    }

    if (
      /where|address|location|direction|map|찾아|주소|위치|어디|길 안내/.test(text)
    ) {
      return "location";
    }

    if (
      /food|dish|menu|eat|eel|side dish|available|음식|메뉴|장어|요리|먹을|반찬/.test(text)
    ) {
      return "food";
    }

    if (
      /phone|call|contact|number|전화|연락처|연락/.test(text)
    ) {
      return "contact";
    }

    return "unknown";
  }

  function answerQuestion(question) {
    const cleanQuestion = question.trim();

    if (!cleanQuestion) return;

    chatHasConversation = true;
    addMessage(cleanQuestion, "user");

    const topic = detectTopic(cleanQuestion);
    const answer = getAnswer(topic);

    // Short delay gives the reply a conversational feel.
    window.setTimeout(() => {
      addMessage(answer, "bot");
    }, 180);
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const question = chatInput.value;
      if (!question.trim()) return;

      chatInput.value = "";
      answerQuestion(question);
    });
  }

  quickQuestions.forEach((button) => {
    button.addEventListener("click", () => {
      const topic = button.dataset.question;

      const questionLabels = {
        food: {
          en: "What food and ingredients are available?",
          ko: "어떤 음식과 재료를 사용하나요?"
        },
        price: {
          en: "What is the price range?",
          ko: "가격대가 어떻게 되나요?"
        },
        hours: {
          en: "What are the opening hours?",
          ko: "영업시간이 어떻게 되나요?"
        },
        location: {
          en: "Where is the restaurant?",
          ko: "식당 주소가 어디인가요?"
        }
      };

      const language = getLanguage();
      const question =
        questionLabels[topic]?.[language] ||
        button.textContent.trim();

      answerQuestion(question);
    });
  });
});


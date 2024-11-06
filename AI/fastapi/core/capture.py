from pyvirtualdisplay import Display
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

def capture_chart_screenshot():
    print(">>> 스크린샷 캡처 시작")

    # 가상 디스플레이 설정
    display = Display(visible=0, size=(1920, 1080))
    display.start()

    chrome_driver_path = os.getenv('CHROMEDRIVER_PATH', '/usr/bin/chromedriver')
    print(f"ChromeDriver 경로: {chrome_driver_path}")

    chrome_options = Options()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--headless=new')  # 새로운 헤드리스 모드 사용
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--disable-software-rasterizer')
    chrome_options.add_argument('--disable-features=VizDisplayCompositor')
    chrome_options.add_argument('--no-zygote')
    chrome_options.add_argument('--single-process')
    chrome_options.add_argument('--disable-infobars')
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_argument('--disable-browser-side-navigation')
    chrome_options.add_argument('--disable-background-networking')
    chrome_options.add_argument('--disable-client-side-phishing-detection')
    chrome_options.add_argument('--disable-hang-monitor')
    chrome_options.add_argument('--disable-popup-blocking')
    chrome_options.add_argument('--disable-prompt-on-repost')
    chrome_options.add_argument('--disable-sync')
    chrome_options.add_argument('--metrics-recording-only')
    chrome_options.add_argument('--no-first-run')
    chrome_options.add_argument('--safebrowsing-disable-auto-update')
    chrome_options.add_argument('--remote-debugging-port=9222')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

    chrome_options.binary_location = os.getenv('CHROME_BIN', '/usr/bin/chromium')

    try:
        service = Service(chrome_driver_path)
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.set_page_load_timeout(30)  # 페이지 로드 타임아웃 설정
        print("WebDriver 초기화 성공")

        url = "https://upbit.com/full_chart?code=CRIX.UPBIT.KRW-BTC"
        print(f"URL로 이동 중: {url}")
        
        # 페이지 로드 재시도 메커니즘 추가
        max_attempts = 3
        for attempt in range(max_attempts):
            try:
                driver.get(url)
                break
            except Exception as e:
                if attempt == max_attempts - 1:
                    raise
                print(f"페이지 로드 실패, 재시도 {attempt + 1}/{max_attempts}")
                time.sleep(5)

        # 페이지 완전 로드를 위한 대기
        time.sleep(5)

        print("차트 요소가 로드될 때까지 기다리는 중...")
        chart_element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='fullChartiq']"))
        )
        
        # 차트가 완전히 렌더링될 때까지 추가 대기
        time.sleep(5)

        print("메뉴 버튼이 클릭 가능해질 때까지 기다리는 중...")
        menu_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='fullChartiq']/div/div/div[1]/div/div/cq-menu[1]/span/cq-clickable"))
        )
        driver.execute_script("arguments[0].click();", menu_button)
        print("메뉴 버튼 클릭 완료.")

        time.sleep(2)

        print("4시간 버튼이 클릭 가능해질 때까지 기다리는 중...")
        four_hour_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='fullChartiq']/div/div/div[1]/div/div/cq-menu[1]/cq-menu-dropdown/cq-item[9]"))
        )
        driver.execute_script("arguments[0].click();", four_hour_button)
        print("4시간 버튼 클릭 완료.")

        time.sleep(5)  # 차트 업데이트를 위한 충분한 대기 시간

        # 스크린샷 저장 경로 설정
        current_dir = os.path.dirname(os.path.abspath(__file__))
        screenshot_folder = os.path.join(current_dir, "images")
        os.makedirs(screenshot_folder, exist_ok=True)
        current_time = datetime.now().strftime("%m%d_%H")
        screenshot_path = os.path.join(screenshot_folder, f"{current_time}_upbit_full_chart_4hour.png")

        # 전체 페이지 스크린샷
        driver.save_screenshot(screenshot_path)
        print(f"스크린샷 저장 완료: {screenshot_path}")

        return screenshot_path

    except Exception as e:
        print(f"capture_chart_screenshot에서 오류 발생: {str(e)}")
        print(f"오류 유형: {type(e).__name__}")
        import traceback
        print(f"트레이스백: {traceback.format_exc()}")
        raise

    finally:
        if 'driver' in locals():
            driver.quit()
            print("WebDriver 닫힘.")
        if 'display' in locals():
            display.stop()
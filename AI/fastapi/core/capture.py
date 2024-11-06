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
    display = None
    driver = None

    try:
        # 가상 디스플레이 설정
        display = Display(visible=0, size=(1920, 1080))
        display.start()

        chrome_driver_path = os.getenv('CHROMEDRIVER_PATH', '/usr/bin/chromedriver')
        print(f"ChromeDriver 경로: {chrome_driver_path}")

        chrome_options = Options()
        
        # 기본 옵션 설정
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--headless=new')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        
        # DevTools 관련 옵션 수정
        chrome_options.add_argument('--remote-debugging-address=0.0.0.0')
        chrome_options.add_argument('--remote-debugging-port=0')  # 자동 포트 할당
        
        # 메모리 관련 옵션 추가
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-software-rasterizer')
        chrome_options.add_argument('--disable-features=VizDisplayCompositor')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-background-networking')
        chrome_options.add_argument('--disable-sync')
        chrome_options.add_argument('--disk-cache-size=0')
        
        # 안정성 관련 옵션
        chrome_options.add_argument('--force-device-scale-factor=1')
        chrome_options.add_argument('--disable-background-timer-throttling')
        chrome_options.add_argument('--disable-backgrounding-occluded-windows')
        chrome_options.add_argument('--disable-breakpad')
        chrome_options.add_argument('--disable-component-extensions-with-background-pages')
        chrome_options.add_argument('--disable-features=TranslateUI')
        chrome_options.add_argument('--disable-ipc-flooding-protection')
        chrome_options.add_argument('--enable-features=NetworkService,NetworkServiceInProcess')
        
        # User-Agent 설정
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

        chrome_options.binary_location = os.getenv('CHROME_BIN', '/usr/bin/chromium')

        service = Service(chrome_driver_path)
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.set_page_load_timeout(30)
        print("WebDriver 초기화 성공")

        url = "https://upbit.com/full_chart?code=CRIX.UPBIT.KRW-BTC"
        print(f"URL로 이동 중: {url}")
        
        # 페이지 로드 재시도
        max_attempts = 3
        for attempt in range(max_attempts):
            try:
                driver.get(url)
                # 페이지 로드 완료 확인
                WebDriverWait(driver, 10).until(
                    lambda d: d.execute_script('return document.readyState') == 'complete'
                )
                break
            except Exception as e:
                if attempt == max_attempts - 1:
                    raise
                print(f"페이지 로드 실패 ({attempt + 1}/{max_attempts}): {str(e)}")
                time.sleep(5)

        # 초기 로딩 대기
        print("초기 페이지 로딩 대기...")
        time.sleep(10)

        print("차트 요소가 로드될 때까지 기다리는 중...")
        chart_element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id='fullChartiq']"))
        )
        
        # 차트 렌더링 대기
        print("차트 렌더링 대기...")
        time.sleep(5)

        # JavaScript를 사용하여 차트가 실제로 렌더링되었는지 확인
        is_chart_rendered = driver.execute_script("""
            const chartElement = document.getElementById('fullChartiq');
            return chartElement && chartElement.offsetHeight > 0;
        """)
        
        if not is_chart_rendered:
            raise Exception("차트가 제대로 렌더링되지 않았습니다.")

        print("메뉴 버튼 클릭 시도...")
        menu_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='fullChartiq']/div/div/div[1]/div/div/cq-menu[1]/span/cq-clickable"))
        )
        driver.execute_script("arguments[0].click();", menu_button)
        print("메뉴 버튼 클릭 완료")

        time.sleep(3)

        print("4시간 버튼 클릭 시도...")
        four_hour_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='fullChartiq']/div/div/div[1]/div/div/cq-menu[1]/cq-menu-dropdown/cq-item[9]"))
        )
        driver.execute_script("arguments[0].click();", four_hour_button)
        print("4시간 버튼 클릭 완료")

        # 차트 업데이트 대기
        time.sleep(10)

        # 스크린샷 저장
        screenshot_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
        os.makedirs(screenshot_folder, exist_ok=True)
        current_time = datetime.now().strftime("%m%d_%H")
        screenshot_path = os.path.join(screenshot_folder, f"{current_time}_upbit_full_chart_4hour.png")

        # 전체 페이지 스크린샷
        total_height = driver.execute_script("return document.body.scrollHeight")
        driver.set_window_size(1920, total_height)
        time.sleep(2)
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
        if driver:
            try:
                driver.quit()
                print("WebDriver 종료 완료")
            except Exception as e:
                print(f"WebDriver 종료 중 오류 발생: {str(e)}")
        
        if display:
            try:
                display.stop()
                print("가상 디스플레이 종료 완료")
            except Exception as e:
                print(f"가상 디스플레이 종료 중 오류 발생: {str(e)}")
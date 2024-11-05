from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import platform

def capture_chart_screenshot():
    # 현재 파일의 절대 경로를 기준으로 드라이버 경로 설정
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # 운영 체제에 따른 크롬 드라이버 경로 설정
    if platform.system() == "Windows":
        chrome_driver_path = os.path.join(current_dir, "chromedriver-win64", "chromedriver.exe")
    elif platform.system() == "Linux":
        chrome_driver_path = os.path.join(current_dir, "chromedriver-linux64", "chromedriver")
    else:
        raise EnvironmentError("Unsupported operating system. Only Windows and Linux are supported.")

    print("Chrome driver path set to:", chrome_driver_path)

    chrome_options = Options()
    chrome_options.binary_location = os.getenv('CHROME_BIN', '/usr/bin/chromium')
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920x1080")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--enable-unsafe-swiftshader")

    service = Service(chrome_driver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)

    print("WebDriver initialized successfully.")

    try:
        url = "https://upbit.com/full_chart?code=CRIX.UPBIT.KRW-BTC"
        print("Navigating to URL:", url)
        driver.get(url)

        print("Waiting for chart element to load...")
        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, "//*[@id='fullChartiq']")))
        print("Chart element loaded successfully.")

        print("Waiting for menu button to become clickable...")
        menu_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='fullChartiq']/div/div/div[1]/div/div/cq-menu[1]/span/cq-clickable"))
        )
        menu_button.click()
        print("Menu button clicked.")

        print("Waiting for four-hour button to become clickable...")
        four_hour_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='fullChartiq']/div/div/div[1]/div/div/cq-menu[1]/cq-menu-dropdown/cq-item[9]"))
        )
        four_hour_button.click()
        print("Four-hour button clicked.")

        time.sleep(2)

        # 스크린샷 저장 경로 설정
        screenshot_folder = os.path.join(current_dir, "..", "images")
        os.makedirs(screenshot_folder, exist_ok=True)
        current_time = datetime.now().strftime("%m%d_%H")
        screenshot_path = os.path.join(screenshot_folder, f"{current_time}_upbit_full_chart_4hour.png")

        driver.save_screenshot(screenshot_path)
        print("Screenshot saved at:", screenshot_path)

        return screenshot_path

    except Exception as e:
        print(f"Error in capture_chart_screenshot: {e}")

    finally:
        driver.quit()
        print("WebDriver closed.")

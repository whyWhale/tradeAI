from datetime import datetime
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
import time
import os
import platform
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def capture_chart_screenshot():
    # Python에서 현재 디렉토리 가져오기
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 운영 체제와 아키텍처에 따른 GeckoDriver 경로 설정
    if platform.system() == "Windows":
        # Windows 64비트
        gecko_driver_path = os.path.join(current_dir, "geckodriver-v0.35.0-win64", "geckodriver.exe")
    elif platform.system() == "Linux" and platform.machine() == "aarch64":
        # Linux ARM64
        gecko_driver_path = os.path.join(current_dir, "geckodriver-v0.35.0-linux-aarch64", "geckodriver")
    else:
        raise EnvironmentError("WebDriver: Unsupported operating system or architecture.")

    firefox_options = FirefoxOptions()
    firefox_options.add_argument("--headless")
    firefox_options.add_argument("--no-sandbox")
    firefox_options.add_argument("--disable-gpu")
    
    service = FirefoxService(gecko_driver_path)
    driver = webdriver.Firefox(service=service, options=firefox_options)
    
    print("WebDriver: WebDriver initialized successfully.")

    try:
        url = "https://upbit.com/full_chart?code=CRIX.UPBIT.KRW-BTC"
        print("WebDriver: Navigating to URL:", url)
        driver.get(url)

        print("WebDriver: Waiting for chart element to load...")
        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, "//*[@id='fullChartiq']")))
        print("WebDriver: Chart element loaded successfully.")

        print("WebDriver: Waiting for menu button to become clickable...")
        menu_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='fullChartiq']/div/div/div[1]/div/div/cq-menu[1]/span/cq-clickable"))
        )
        menu_button.click()
        print("WebDriver: Menu button clicked.")

        print("WebDriver: Waiting for four-hour button to become clickable...")
        four_hour_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='fullChartiq']/div/div/div[1]/div/div/cq-menu[1]/cq-menu-dropdown/cq-item[9]"))
        )
        four_hour_button.click()
        print("WebDriver: Four-hour button clicked.")

        time.sleep(2)

        # 스크린샷 저장 경로 설정
        screenshot_folder = os.path.join(current_dir, "..", "images")
        os.makedirs(screenshot_folder, exist_ok=True)
        current_time = datetime.now().strftime("%m%d_%H")
        screenshot_path = os.path.join(screenshot_folder, f"{current_time}_upbit_full_chart_4hour.png")

        driver.save_screenshot(screenshot_path)
        print("WebDriver: Screenshot saved at:", screenshot_path)

        return screenshot_path

    except Exception as e:
        print(f"WebDriver: Error in capture_chart_screenshot: {e}")

    finally:
        driver.quit()
        print("WebDriver: WebDriver closed.")

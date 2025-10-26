import requests
import validators #pip install validators, request, BeautifulSoup and lxml.
from bs4 import BeautifulSoup

print("\n\t\t  \" ONLINE WEB SCRAPER MADE IT EASY \"\n\n ")
def hrline(len, char='-'):
  print(char*len)
while True:
  url=input("\nENTER THE URL LINK OF THE PAGE TO START WEB SCRAPING : ")
  if validators.url(url):
    try:
      res = requests.get(url)
      print("\n")
      if res.status_code != 200:
        print("\"Sorry! The link which you are trying to Scrap is well Authorised and Data cannot be Extracted from it!\"\n*** Please Provide a New Link to Start Scraping ***\n")
        hrline(200)
      else:
        print("\"Congratulations! Here we go, Your Webpage is ready for Scraping, Extracting all the Data...\"")
        print("\n\nWhat are you expecting to print? Give me the detail by Typing \"1/2/3/4\"\n1. Extract full HTML Code\n2. Extract all the Text from the WebPage\n3. Extract Only Headings from the Webpage\n4. Extract Links from the Webpage\n")
        choice = input("Enter Your choice to Extract the Data from \"1/2/3/4\" : ")
        while True:
          soup = BeautifulSoup(res.text,"lxml")
          if choice in ["1","one","One","ONE"]:
            print("\nYep! Here is the Full HTML CODE extracted from Webpage :",url,"\n")
            hrline(200)
            print(soup)
            print("\n THE CODE ENDS HERE! After Copying is Done * For More Scraping continue with the Same Procedure below *,")
            hrline(200)
            break
          elif choice in ["2","two","Two","TWO"]:
            print("\nNice Choice! Here we go, Extracting all the Text from the WebPage... It may take some while\n")
            print("NOTE : A Point to Remember is, We help you only to extract all the Data which is in text format\nfrom the WebPage but we cannot give you the manned Structure and Order of the Text as per the Website your referring to.\nHere's all the Text extracted from :",url,"\n")
            hrline(200)
            for tag in soup.find_all():
              print(tag.get_text())
            print("\n\nThe Above is the unordered Collection of the Text! as mentioned in the NOTE,\nAs this is an sensitive Unordered Collection, Copy your required text carefully for the above Data!\n")
            print("\n THE TEXT ENDS HERE! After Copying is Done * For More Scraping continue with the Same Procedure below *,")
            hrline(200)
            break
          elif choice in ["3","three","Three","THREE"]:
            print("\nLet's Get all the Headings from the WebPage... Working on it\n")
            print("NOTE : A Point to Remember is, We help you only to extract all the Data which are the main Heading, also preferred to be <h1> and <h2> formats only\nfrom the WebPage but we cannot give you the manned Structure and Order of the Text as per the Website your referring to.\nHere's all the Headings extracted from :",url,"\n")
            hrline(200)
            heading_tags = ['h1', 'h2']
            for tag in soup.find_all(heading_tags):
              print(tag.get_text())
            hrline(200)
            break
          elif choice in ["4","four","Four","FOUR"]:
            print("\nLet's Get all the Links from the WebPage... Working on it\n")
            hrline(200)
            anchor_tags = soup.find_all('a')
            for tag in anchor_tags:
              url = tag.get('href')
              if url:
                print(url)
            hrline(200)
            break
          else:
            hrline(200)
            print("Please Enter a Valid Choice, Try again and Type between \"1/2/3/4\"\nHope we will be Getting you this time :)")
          hrline(200)


    except requests.exceptions.RequestException:
      hrline(200)
      print("\n\"Sorry! There was an error while attempting to make a request. Please provide a valid URL.\"\n*** Please Provide a New Link to Start Scraping ***\n")
      hrline(200)
  else:
    hrline(200)
    print("\n\"Sorry! The input is not a valid URL. Please provide a valid URL.\"\n*** Please Provide a New Link to Start Scraping ***\n")
    hrline(200)

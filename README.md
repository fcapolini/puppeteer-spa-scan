# puppeteer-spa-scan

Collects network requests issued by a Single Page Application in a JSON file.

Installation

```bash
npm install
```

Launch

```
npm start [url] [output-name] [unique-entries]
```

Parameters:
* url: page url (default: http://testphp.vulnweb.com/AJAX/)
* output-name: name of the output file (default: output.json)
* unique-entries: removes repeated entries from the output (default: true)

Sample output

```json
[
    "GET http://testphp.vulnweb.com/AJAX/artists.php",
    "GET http://testphp.vulnweb.com/AJAX/infoartist.php?id=1",
    "GET http://testphp.vulnweb.com/AJAX/infoartist.php?id=2",
    "GET http://testphp.vulnweb.com/AJAX/infoartist.php?id=3",
    "GET http://testphp.vulnweb.com/AJAX/categories.php",
    "GET http://testphp.vulnweb.com/AJAX/infocateg.php?id=1",
    "GET http://testphp.vulnweb.com/AJAX/infocateg.php?id=2",
    "GET http://testphp.vulnweb.com/AJAX/infocateg.php?id=3",
    "GET http://testphp.vulnweb.com/AJAX/infocateg.php?id=4",
    "GET http://testphp.vulnweb.com/AJAX/titles.php",
    "POST http://testphp.vulnweb.com/AJAX/infotitle.php",
    "POST http://testphp.vulnweb.com/AJAX/showxml.php"
]
```

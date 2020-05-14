# JS Rubik Cube:
This project will provide all the logic in order to create a represent a fully functional Rubik's Cube.

![Cube](https://cdn.jsdelivr.net/gh/Jkutkut/JS-Rubik_Cube@master/assets/img/cube-3x3.jpg)

## How to play:
There are 2 options:
-Download the repository (See the top right corner) as a .zip file. Once finnished, unzip it and open on your browser the file called "index.html"
-Follow the link "Play now". It will show a message similar to "Conection is not secure". Press "advance settings" and then "proceed to page" 

### *[Play Now!](https://jkutkut.memoriadeelefante.com/github/JS-Rubik_Cube/index.html)*

## Controls:

### Main menu:
In order to select the type of cube, use the mouse and click over the desired icon. The avalible options are:

- Normal: The classic cube aperance.
- Mirror: A version of the 3x3x3 mirror cube.
- Invisible: An invisible version where the user can only see the stickers of the cube.
- Stickerless: A version where the whole cube is filled completly, leaving no margins.

In order to select the dimension of the cube (3x3x3, 4x4x4...), use the mouse wheel.

Once the parametres are correct, press the start button in order to launch the game.

### Game:
Once the start button is pressed, the game will start. 
- Camera movement: Use the mouse to drag the camera around the cube. Use the mouse wheel to zoom in and out.
- When the camera moves over a cube's face, the second canvas will show the face on the bottom right corner. Make the desired move using the mouse, dragging the desired piece.
- Whenever you want to take a screenshot, just press right click on the canvas and select "save image" 

## Important note:
This project uses a repository named [JS-tools](https://github.com/Jkutkut/JS-tools), a custom library that provides different tools to simplify the sintax and the logic.
In order for the HTML file to use this library, make sure it is loaded on index.html or ensure to link all these files (and change the script tags):
   
    JS-Rubik_Cube
      ├── assets
      │   ├── credits.md
      │   ├── data
      │   │   ├── notesRubiksCube.jpg
      │   │   └── rubikPermutation1.mp4
      │   └── img
      │       ├── cube-2x2.jpg
      │       ├── cube-3x3.jpg
      │       ├── cube-4x4.jpg
      │       ├── cube-5x5.jpg
      │       ├── cube-invisible.jpg
      │       ├── cube-mirror.jpg
      │       ├── cube-stickerless.jpg
      │       ├── mainBG.jpg
      │       ├── mainBG.xcf
      │       ├── select-type-cube.png
      │       ├── start-icon.png
      │       └── title.png
      ├── index.html
      ├── README.md
      ├── rubikLogic
      │   ├── RubikCube.js
      │   ├── RubikPiece.js
      │   └── RubikSticker.js
      ├── sketch.js
      ├── style.css
      └── ThingsToDo.md
    JS-tools
      ├── functions.js
      ├── matrix
      │   ├── array_nD.js
      │   ├── doc
      │   │   ├── lineal transformations_english.pdf
      │   │   └── lineal transformations.pdf
      │   ├── matrix.js
      │   └── matrixRepresentation.js
      ├── README.md
      └── thingsToDo.md




## Content:

- Main menu interface
- Rubik's cube logic
- Documentation


*See [credits](https://github.com/Jkutkut/JS-Rubik_Cube/blob/v4.2/assets/credits.md) to thank all the help to make the interface*

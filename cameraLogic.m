clear;
clc;
cla reset;

% Cube settings
rubikDim = 3;
cubeW = 100;

% Code
hold on;

% Draw visual help
ejesX = [[1, -1]; [1, -1]; [0, 0]];
ejesY = [[1, -1]; [-1, 1]; [0, 0]];
ejesZ = [[0,  0]; [0,  0]; [sqrt(2), -sqrt(2)]];
for x = 1:3
    plot3(ejesX(x, :) .* cubeW, ejesY(x, :) .* cubeW, ejesZ(x, :) .* cubeW, "k-");
end

% draw Cube border
pieces = [-rubikDim / 2, rubikDim / 2] .* cubeW;
for p1 = pieces
    for p2 = pieces
        plot3([p1, p1], [p2, p2], pieces, "k")
        plot3([p1, p1], pieces, [p2, p2], "k")
        plot3(pieces, [p1, p1], [p2, p2], "k")
    end
end

m = 0.5 : rubikDim / 2;
for p1 = pieces
    for mm = m
        pieces2 = [-1, 1] .* (mm * cubeW);
        for p2 = pieces2
            plot3([p1, p1], [p2, p2], pieces, "g")
            plot3([p2, p2], [p1, p1], pieces, "g")
            plot3([p1, p1], pieces, [p2, p2], "g")
            plot3([p2, p2], pieces, [p1, p1], "g")
            plot3(pieces, [p1, p1], [p2, p2], "g")
            plot3(pieces, [p2, p2], [p1, p1], "g")
        end
    end
end




% Camera
ampli = 700;
angX = 0.25 * pi;
angZ = 0.25 * pi;

trueIncX = 0;
trueIncZ = 0;

camX =  ampli * cos(angX + trueIncX) * sin(angZ + trueIncZ);
camY =  ampli * sin(angX + trueIncX) * sin(angZ + trueIncZ);
camZ =  ampli * cos(angZ + trueIncZ);

% [camX, camY, camZ]
p = plot3(camX, camY, camZ, "b*");

mult = 1;
axis([-ampli * mult, ampli * mult, -ampli * mult, ampli * mult, -ampli * mult, ampli * mult])
hold off;
grid;
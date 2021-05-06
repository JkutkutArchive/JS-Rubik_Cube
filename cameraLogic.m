clear;
clc;

% Cube settings
rubikDim = 3;
cubeW = 100;

% Code
hold on;

ejesX = [[1, -1]; [1, -1]; [0, 0]];
ejesY = [[1, -1]; [-1, 1]; [0, 0]];
ejesZ = [[0,  0]; [0,  0]; [sqrt(2), -sqrt(2)]];
for x = 1:3
    plot3(ejesX(x, 1:2) .* cubeW, ejesY(x, 1:2) .* cubeW, ejesZ(x, 1:2) .* cubeW, "k-");
end

faceX = [cubeW * 0.5, -cubeW * 0.5];
for x1 = faceX
    for x2 = faceX
        for y1 = faceX
            for y2 = faceX
                plot3([x1, x2], [y1, y2], [0, 0], "g*");
            end
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
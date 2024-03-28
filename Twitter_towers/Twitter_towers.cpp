#include <iostream>
using namespace std;
enum TOWER_SHAPE { EXIT,RECTANGLE, TRIANGULAR };
enum TRIANGULAR_TOWER{ SCOPE=1,PRINT };
void rectangle(int width, int height);
void triangular(int width, int height);
void dataEntry(int& width, int& height);
void CalculatingPrintTriangle(int widthTemp, int heightTemp, int hTemp, int width);
int main()
{
	int op = 1;
	int width;
	int height;
	while (op)
	{
		cout << "Enter 1 to create a rectangle" <<endl<<
			"Enter 2 to create a triangle" <<endl<<
			"Enter 0 to exit" << endl;
		cin >> op;
		switch (op)
		{
		    case RECTANGLE:
				dataEntry(width, height);
			while(width < 2 || height <= 0)
			{
				cout << "ERROR" << endl;
				dataEntry(width, height);
			}
			rectangle(width, height);
			break;
		case TRIANGULAR:
			dataEntry(width, height);
			while(width <=0 || height <= 0)
			{
				cout << "error" << endl;
				dataEntry(width, height);
			}
			triangular(width, height);
			break;
		case EXIT:
			break;
		default:
			break;
		}
	}
	return 0;
}
void rectangle(int width, int height) {
	if (width - height > 5 ||height-width>5|| width == height)
		cout << width * height << endl;
	else
		cout << (width + height) * 2 << endl;
}

void triangular(int width, int height) {
	int op = 1;
	int widthTemp;
	int heightTemp;
	int hTemp;
	while (op)
	{

		cout << "Enter 1 to calculate the perimeter of the tower"<<endl<<
			"Press 2 to print the tower" << endl;
		cin >> op;
		switch (op)
		{
		case SCOPE:
			double side= sqrt(pow(width / 2, 2) + pow(height, 2));
			cout << side*2 + width << endl;
			break;
		case PRINT:
			if (width % 2 == 0 || width > height * 2)
			{
				cout << "The triangle cannot be printed" << endl;
				return;
			}
			widthTemp = width - 2;
			widthTemp = widthTemp / 2;
			heightTemp = height - 2;
			hTemp = heightTemp / widthTemp;
			heightTemp %= widthTemp;
			for (int k = 0; k < (width - 1) / 2; k++)
			{
				cout << " ";
			}
			cout << "*" << endl;
			CalculatingPrintTriangle(widthTemp, heightTemp, hTemp, width);
			for (int k = 0; k < width; k++)
			{
				cout << "*";
			}
			cout << endl;
			return;
		default:
			break;
		}
	}
}

void dataEntry(int& width, int& height)
{
	cout << "Enter a width:" << endl;
	cin >> width;
	cout << "Enter a height:" << endl;
	cin >> height;
}

void CalculatingPrintTriangle(int widthTemp, int heightTemp, int hTemp, int width)
{
	int s = 3;
	for (int i = 0; i < widthTemp; i++)
	{
		for (int j = 0; j < heightTemp + hTemp; j++)
		{
			for (int k = 0; k < (width - s) / 2; k++)
			{
				cout << " ";
			}
			for (int k = 0; k < s; k++)
			{
				cout << "*";
			}
			cout << endl;
		}
		hTemp = 0;
		s += 2;
	}
}

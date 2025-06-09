import tkinter as tk
import calendar 

def mostrar_calendario(año, mes):
    cal = calendar.month(año, mes)
    texto.config(text=cal)

root = tk.Tk()
root.title("Calendario en Python")

texto = tk.Label(root, font=("Courier", 14), justify="left")
texto.pack(padx=20, pady=20)

mostrar_calendario(2025, 5)

root.mainloop()

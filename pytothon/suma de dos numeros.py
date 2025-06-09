import tkinter as tk

def sumar():
    try:
        num1 = int(entry_num1.get())
        num2 = int(entry_num2.get())
        resultado.config(text=f"Suma: {num1 + num2}")
    except ValueError:
        resultado.config(text="❌ Ingresa solo números enteros")

def multiplicar():
    try:
        num1 = int(entry_num1.get())
        num2 = int(entry_num2.get())
        resultado.config(text=f"Multiplicación: {num1 * num2}")
    except ValueError:
        resultado.config(text="❌ Ingresa solo números enteros")

# Ventana principal
root = tk.Tk()
root.title("Calculadora Básica")
root.geometry("300x250")

# Entradas de números
tk.Label(root, text="Número 1:").pack(pady=5)
entry_num1 = tk.Entry(root)
entry_num1.pack()

tk.Label(root, text="Número 2:").pack(pady=5)
entry_num2 = tk.Entry(root)
entry_num2.pack()

# Botones de operación
tk.Button(root, text="Sumar", command=sumar).pack(pady=10)
tk.Button(root, text="Multiplicar", command=multiplicar).pack()

# Resultado
resultado = tk.Label(root, text="", font=("Arial", 14))
resultado.pack(pady=15)

root.mainloop()

import tkinter as tk

def suma(a, b):
    return a + b

def resta(a, b):
    return a - b

def multiplicacion(a, b):
    return a * b

def division(a, b):
    if b == 0:
        return "Error: División por cero"
    return a / b
def logaritmo(a, b):
    import math
    if a <= 0 or b <= 0:
        return "Error: Logaritmo de números no positivos"
    return math.log(a, b)

def calcular(operacion):
    try:
        a = float(entry1.get())
        b = float(entry2.get())
        
        if operacion == "suma":
            resultado = suma(a, b)
        elif operacion == "resta":
            resultado = resta(a, b)
        elif operacion == "multiplicacion":
            resultado = multiplicacion(a, b)
        elif operacion == "division":
            resultado = division(a, b)
        elif operacion == "logaritmo":
            resultado = logaritmo(a, b)
        else:
            resultado = "Operación no válida"
        # Actualizar etiqueta de resultado
        if isinstance(resultado, str):
            label_resultado.config(text=resultado)
        else:
            # Formatear el resultado a dos decimales
            resultado = f"{resultado:.2f}"  
        
        label_resultado.config(text=f"Resultado: {resultado}")
    except ValueError:
        label_resultado.config(text="Error: Ingresa números válidos")

# Crear ventana
window = tk.Tk()
window.title("Calculadora Simple")

# Título
label = tk.Label(window, text="Calculadora Simple")
label.pack()

# Entradas de texto
entry1 = tk.Entry(window)
entry1.pack()

entry2 = tk.Entry(window)
entry2.pack()

# Botones
tk.Button(window, text="Suma", command=lambda: calcular("suma")).pack()
tk.Button(window, text="Resta", command=lambda: calcular("resta")).pack()
tk.Button(window, text="Multiplicación", command=lambda: calcular("multiplicacion")).pack()
tk.Button(window, text="División", command=lambda: calcular("division")).pack()
tk.Button(window, text="Logaritmo", command=lambda: calcular("logaritmo")).pack()

# Resultado
label_resultado = tk.Label(window, text="Resultado:")
label_resultado.pack()

# Ejecutar ventana
window.mainloop()

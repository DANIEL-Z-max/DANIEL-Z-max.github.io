import tkinter as tk
import random
import string

def generar_contraseña():
    try:
        longitud = int(entry_longitud.get())
        if longitud < 4:
            resultado.config(text=" Mínimo 4 caracteres")
            return

        caracteres = string.ascii_letters + string.digits + string.punctuation
        contraseña = ''.join(random.choice(caracteres) for _ in range(longitud))
        resultado.config(text=contraseña)
        root.clipboard_clear()
        root.clipboard_append(contraseña)
    except ValueError:
        resultado.config(text=" Ingresa un número válido")

# Ventana principal
root = tk.Tk()
root.title("Generador de Contraseñas")
root.geometry("350x200")

# Título
tk.Label(root, text="Generador de Contraseñas Aleatorias", font=("Arial", 12, "bold")).pack(pady=10)

# Entrada de longitud
tk.Label(root, text="Longitud de la contraseña:").pack()
entry_longitud = tk.Entry(root)
entry_longitud.insert(0, "12")  # Valor por defecto
entry_longitud.pack()

# Botón para generar
tk.Button(root, text="Generar Contraseña", command=generar_contraseña).pack(pady=10)

# Resultado
resultado = tk.Label(root, text="", font=("Courier", 12), wraplength=320)
resultado.pack()

root.mainloop()

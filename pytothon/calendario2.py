import tkinter as tk
import calendar

def mostrar_calendario():
    try:
        anio = int(entry_anio.get())
        mes = int(entry_mes.get())
        if 1 <= mes <= 12:
            cal = calendar.month(anio, mes)
            texto.config(text=cal)
        else:
            texto.config(text=" El mes debe estar entre 1 y 12.")
    except ValueError:
        texto.config(text=" Año y mes deben ser números enteros.")

root = tk.Tk()
root.title("Calendario Interactivo en Python")
root.geometry("300x350")

# Entrada de Año
tk.Label(root, text="Año:").pack()
entry_anio = tk.Entry(root)
entry_anio.insert(0, "2025")
entry_anio.pack()

# Entrada de Mes
tk.Label(root, text="Mes (1-12):").pack()
entry_mes = tk.Entry(root)
entry_mes.insert(0, "6")
entry_mes.pack()

# Botón para mostrar calendario
tk.Button(root, text="Mostrar Calendario", command=mostrar_calendario).pack(pady=10)

# Etiqueta para mostrar el calendario
texto = tk.Label(root, font=("Courier", 12), justify="left", bg="white", relief="solid", padx=10, pady=10)
texto.pack(padx=10, pady=10, fill="both", expand=True)

# Mostrar uno inicial
mostrar_calendario()

root.mainloop()

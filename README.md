# Fractal Generator

Welcome to the **Fractal Generator**, an advanced visualization tool designed to explore and analyze the fascinating world of fractals. This project provides a comprehensive set of methods and algorithms to study complex fractal structures like the **Mandelbrot set**, **Julia sets**, and their generalized forms.

Whether you are a **mathematician**, a **student**, a **developer**, or simply curious about fractals, this tool lets you dive deep into their properties, rendering techniques, and mathematical intricacies.  
It is intended both for educational purposes and for anyone interested in experimenting with fractal visualization.

Feel free to explore the code, run the application, and customize it to suit your needs.  
**Contributions and feedback are welcome!**

# Fundamentals of Fractal Theory

## Iterating Process

The iterating process begins with a complex function of the form:

z_{n+1} = f(z_n)

An initial value z_0 is chosen, and the function is applied iteratively:

z_1 = f(z_0),  z_2 = f(z_1), ...,z_n = f(z_{n-1})

This sequence of values { z_0, z_1, z_2, ... } is called the **orbit** of z_0.

## Behavior of the Orbit

The behavior of an orbit can be classified into three main types based on the iteration process:

- **Convergence**: If the sequence of iterated values {z_n} converges to a fixed point.
- **Divergence**: If the sequence {z_n} tends to infinity as n -> ∞.
- **Periodicity**: If the sequence {z_n} starts repeating itself after a certain number of iterations.

---

Let's define the **Generalized Mandelbrot** and **Julia sets** for a general exponent d, and later extend the discussion to transcendental functions like sine, cosine, and the exponential function.

## Generalized Mandelbrot and Julia Sets

Both the Generalized Mandelbrot and Julia sets are generated by iterating the function:

z_{n+1} = z_n^d + c

where d ∈ Q and c is a complex constant.

### Generalized Mandelbrot Set

In the Generalized Mandelbrot set, starting from z_0 = 0, we iterate the function:

z_{n+1} = z_n^d + c

for each value of c in the complex plane.  
- If the resulting sequence {z_n} **remains bounded** after a set number of iterations, then the point c belongs to the Generalized Mandelbrot set.
- If the sequence **diverges** (i.e., |z_n| -> ∞), then c does not belong to the set.

### Generalized Julia Set

For the Generalized Julia set, we keep c **fixed** and iterate the function:

z_{n+1} = z_n^d + c

for different initial points z_0.  
The structure of the Julia set depends heavily on the value of c, showing rich and complex behavior.

---

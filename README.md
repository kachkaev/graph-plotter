# Graph plotter

TypeScript + React port of the VK Graph Plotter app written in Flash in 2009-2010

- [Deployed version (VK app)](https://vk.com/graph_plotter)
- [Deployed version (standalone)](http://graph-plotter.vercel.app)
- [App community (in Russian)](https://vk.com/graph_plotter_club)

## Local development

```sh
yarn install
yarn dev
```

## Interesting charts

Wave

```txt
x*random()+sin(x)
```

Heart

```txt
(sqrt(cos(x/5))*cos(1000*x/5)+sqrt(abs(x/5))-0.4)*((4-((x/5)^2))^0.1)*5
```

Batman

```txt
5 - abs(x) > 0
    ? abs(x) - 1.8 > 0
      ? ((0.3 * x - round(0.3 * x)) * x * 2 + 3) * sign(sin(180 * x))
      : sin(180 * x)
      ? ((0.3 * x - round(0.3 * x)) * x * 2 + 3) * sign(sin(180 * x))
      : sqrt(abs(x) ^ 2) * sqrt(5 - (x ^ 2)) - 3.8
    : sign(sin(180 * x)) * sqrt(87 - (x ^ 2))
```

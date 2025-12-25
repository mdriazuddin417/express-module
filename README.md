# express-module (v1.1)

Generates module folders like your `attendance` style:

- `*.controller.ts`
- `*.service.ts`
- `*.model.ts`
- `*.interface.ts`
- `*.validation.ts`
- `*.route.ts`

✅ Default output folder is always **`./modules`**  
✅ If `./modules` does not exist, it will be created automatically  
✅ You can generate **multiple modules in one command**


## One command (single module)

```bash
npx express-module student
# creates ./modules/student/...
```

## One command (multiple modules)

```bash
npx express-module student teacher user auth
# creates:
# ./modules/student/...
# ./modules/teacher/...
# ./modules/user/...
# ./modules/auth/...
```



export const timeConverter = (timer: number) => {
    return [Math.floor(timer / 60), timer % 60 ? timer % 60 : 0];
  };
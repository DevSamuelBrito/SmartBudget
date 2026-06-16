FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/SmartBudgetPro.Domain/SmartBudgetPro.Domain.csproj src/SmartBudgetPro.Domain/
COPY src/SmartBudgetPro.Application/SmartBudgetPro.Application.csproj src/SmartBudgetPro.Application/
COPY src/SmartBudgetPro.Infrastructure/SmartBudgetPro.Infrastructure.csproj src/SmartBudgetPro.Infrastructure/
COPY src/SmartBudgetPro.Shared/SmartBudgetPro.Shared.csproj src/SmartBudgetPro.Shared/
COPY src/SmartBudgetPro.API/SmartBudgetPro.API.csproj src/SmartBudgetPro.API/

RUN dotnet restore src/SmartBudgetPro.API/SmartBudgetPro.API.csproj

COPY src/ .
WORKDIR /src/SmartBudgetPro.API
RUN dotnet publish SmartBudgetPro.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SmartBudgetPro.API.dll"]
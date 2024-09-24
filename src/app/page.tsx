"use client";

import Image from "next/image";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { POKEAPI_BASE_URL } from "./constants";
import { SearchPokemon } from "@/components/SearchPokemon";
import { PokemonsList } from "@/components/PokemonsList";

export default function Home() {
  const searchParams = useSearchParams();

  const pokemon = searchParams.get("pokemon");

  const type = searchParams.get("type");

  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : 20;

  const offset = searchParams.get("offset")
    ? Number(searchParams.get("offset"))
    : 0;

  const currentPage = Math.floor(offset / limit + 1);

  const { data: pokemonsResponse, isLoading } = useQuery({
    queryKey: ["get-pokemons", limit, offset, pokemon, type],
    queryFn: async () => {
      let url = `${POKEAPI_BASE_URL}/pokemon`;

      if (limit && offset) {
        url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
      }

      if (pokemon) {
        url = `${POKEAPI_BASE_URL}/pokemon/${pokemon}`;
      }

      if (type) {
        url = `${POKEAPI_BASE_URL}/type/${type}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const getPokemonRows = () => {
        if (!data.pokemon && !data.results) {
          return [data];
        }

        if (data.pokemon) {
          return data.pokemon.map(
            (item: { pokemon: { name: string; url: string } }) => {
              return {
                name: item.pokemon.name,
                id: item.pokemon.url.split("/")[6],
              };
            }
          );
        }

        if (data.results) {
          return data.results.map(
            ({ name, url }: { name: string; url: string }) => ({
              name,
              // sprite value splitted by url string: explain at README.md
              id: url.split("/")[6],
            })
          );
        }
      };

      const formattedData = {
        ...data,
        results: getPokemonRows(),
      };

      return formattedData;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <>
      {!isLoading && (
        <>
          <SearchPokemon />
          <PokemonsList pokemons={pokemonsResponse?.results} />
          <Pagination
            totalItems={pokemonsResponse?.count}
            itemsPerPage={limit}
            currentPage={currentPage}
          />
        </>
      )}
    </>
  );
}
